package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
	"syscall/js"

	"github.com/devopsfaith/krakend/config"
	"github.com/devopsfaith/krakend/logging"
	"github.com/devopsfaith/krakend/proxy"
	krakendgin "github.com/devopsfaith/krakend/router/gin"
	"github.com/gin-gonic/gin"
)

func parse(i []js.Value) {
	if len(i) < 2 {
		println("not enough args")
		return
	}

	if i[1].Type() != js.TypeFunction {
		println("arg 1 should be a function")
		return
	}

	logger := func(msg string) {
		fmt.Println(msg)
	}
	if len(i) > 2 {
		if i[2].Type() == js.TypeFunction {
			logger = func(msg string) {
				i[2].Invoke(msg)
			}
		}
	}

	client, err := newJSClient(i[0].String(), logger)
	if err != nil {
		logger(err.Error())
		return
	}

	i[1].Invoke(client.Value())
}

func newJSClient(cfg string, logger func(string)) (*JSClient, error) {
	server, err := newServer(cfg)
	if err != nil {
		return nil, err
	}

	return &JSClient{
		client: &Client{server},
		logger: logger,
	}, nil
}

type JSClient struct {
	client *Client
	logger func(string)
}

func (j *JSClient) Value() js.Value {
	opt := js.Global().Get("Object").New()

	opt.Set("close", js.NewCallback(func(_ []js.Value) { j.client.Close() }))

	opt.Set("test", js.NewCallback(func(i []js.Value) {
		if len(i) < 5 {
			j.logger("the test function requires at least 5 arguments: method, path, body, headers and a callback")
			return
		}
		var reqBody io.Reader
		if b := i[2].String(); b != "" {
			reqBody = bytes.NewBufferString(b)
		}
		req, err := http.NewRequest(i[0].String(), i[1].String(), reqBody)
		if err != nil {
			j.logger(err.Error())
			return
		}
		headers := map[string][]string{}
		if err := json.Unmarshal([]byte(i[3].String()), &headers); err != nil {
			j.logger(err.Error())
			return
		}
		req.Header = headers

		go func() {
			resp := j.client.Do(req)
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				j.logger(err.Error())
				return
			}
			resp.Body.Close()

			headers := js.Global().Get("Object").New()
			for k, v := range resp.Header {
				headers.Set(k, v[0])
			}

			jsResp := js.Global().Get("Object").New()
			jsResp.Set("statusCode", resp.StatusCode)
			jsResp.Set("header", headers)
			jsResp.Set("body", string(body))

			i[4].Invoke(jsResp)
		}()
	}))

	return opt
}

type Client struct {
	Server *LocalServer
}

func (c Client) Do(req *http.Request) *http.Response {
	// req.Header.Add("js.fetch:mode", "no-cors") // -> will trigger the CORB protection
	req.Header.Add("js.fetch:credentials", "omit")
	rw := httptest.NewRecorder()
	c.Server.handler(rw, req)
	return rw.Result()
}

func (c *Client) Close() {
	c.Server.close()
}

type LocalServer struct {
	close   func()
	handler func(rw http.ResponseWriter, req *http.Request)
}

func newServer(cfg string) (*LocalServer, error) {
	serviceConfig, err := config.NewParserWithFileReader(func(s string) ([]byte, error) {
		return []byte(s), nil
	}).Parse(cfg)
	if err != nil {
		return nil, err
	}
	serviceConfig.Debug = true

	logger, err := logging.NewLogger("DEBUG", os.Stdout, "[KRAKEND]")
	if err != nil {
		return nil, err
	}

	for _, e := range serviceConfig.Endpoints {
		e.HeadersToPass = append(e.HeadersToPass, "js.fetch:mode", "js.fetch:credentials")
	}

	ctx, cancel := context.WithCancel(context.Background())

	s := &LocalServer{
		close:   cancel,
		handler: func(rw http.ResponseWriter, req *http.Request) {},
	}

	routerFactory := krakendgin.NewFactory(krakendgin.Config{
		Engine:         gin.New(),
		ProxyFactory:   proxy.DefaultFactory(logger),
		Logger:         logger,
		HandlerFactory: krakendgin.EndpointHandler,
		RunServer: func(ctx context.Context, _ config.ServiceConfig, handler http.Handler) error {
			s.handler = handler.ServeHTTP
			<-ctx.Done()
			return ctx.Err()
		},
	})

	go func(ctx context.Context, serviceConfig config.ServiceConfig) {
		routerFactory.NewWithContext(ctx).Run(serviceConfig)
	}(ctx, serviceConfig)

	return s, nil
}

func main() {
	fmt.Println("WASM Go Initialized")

	js.Global().Set("parse", js.NewCallback(parse))

	select {}
}
