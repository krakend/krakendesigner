package main

import (
    "bytes"
    "context"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "strings"
    "syscall/js"

    "github.com/devopsfaith/krakend/config"
    "github.com/devopsfaith/krakend/logging"
    "github.com/devopsfaith/krakend/proxy"
    "github.com/devopsfaith/krakend/transport/http/client"
)

func parse(i []js.Value) {
    println("parsing")

    if len(i) < 2 {
        println("not enough args")
        return
    }

    if i[1].Type() != js.TypeFunction {
        println("arg 1 should be a function")
        return
    }

    cfg, err := config.NewParserWithFileReader(func(s string) ([]byte, error) {
        return []byte(s), nil
    }).Parse(i[0].String())
    if err != nil {
        println(err.Error())
        return
    }

    k := JS{
        c: Config{
            ServiceConfig: cfg,
            res:           make(chan *proxy.Response, 1),
            err:           make(chan error, 1),
        },
    }

    i[1].Invoke(js.NewCallback(k.testEndpoint))
}

type JS struct {
    c Config
}

func (j JS) testEndpoint(i []js.Value) {
    if len(i) < 5 {
        println("not enough args")
        return
    }

    if i[4].Type() != js.TypeFunction {
        println("arg 4 should be a function")
        return
    }

    endpoint := i[0].Int()
    params := map[string]string{}
    if err := json.Unmarshal([]byte(i[1].String()), &params); err != nil {
        println(err.Error())
        return
    }

    headers := map[string][]string{}
    if err := json.Unmarshal([]byte(i[2].String()), &headers); err != nil {
        println(err.Error())
        return
    }

    body := i[3].String()

    j.c.testEndpoint(endpoint, params, headers, body)
    go func() {
        select {
        case err := <-j.c.err:
            println(err.Error())
            return
        case res := <-j.c.res:
            println(res)
            body, _ := json.Marshal(res.Data)
            headers, _ := json.Marshal(res.Metadata.Headers)

            i[4].Invoke(string(body), res.IsComplete, res.Metadata.StatusCode, string(headers))
        }
    }()
}

type Config struct {
    config.ServiceConfig
    res chan *proxy.Response
    err chan error
}

func (c Config) testEndpoint(endpoint int, params map[string]string, headers map[string][]string, body string) {
    if endpoint < 0 || len(c.Endpoints) < endpoint {
        println(fmt.Errorf("unknown endpoint %d", endpoint))
        return
    }
    buf := new(bytes.Buffer)
    logger, _ := logging.NewLogger("DEBUG", buf, "[KRAKEND]")
    p, err := proxy.NewDefaultFactory(proxy.CustomHTTPProxyFactory(client.NewHTTPClient), logger).New(c.Endpoints[endpoint])
    if err != nil {
        println(err.Error())
        return
    }
    cleanParams := make(map[string]string, len(params))
    for k, v := range params {
        cleanParams[strings.Title(k)] = v
    }

    req := &proxy.Request{
        Params:  params,
        Method:  c.Endpoints[endpoint].Method,
        Headers: headers,
    }
    if len(body) > 0 {
        req.Body = ioutil.NopCloser(bytes.NewBufferString(body))
    }

    go func(name string, p proxy.Proxy, buf *bytes.Buffer, req *proxy.Request) {
        println(fmt.Sprintf("calling the pipe %s [%+v]", name, p))
        resp, err := p(context.Background(), req)
        if err != nil {
            c.err <- err
            return
        }
        c.res <- resp
    }(c.Endpoints[endpoint].Endpoint, p, buf, req)

}

func main() {
    println("WASM Go Initialized")

    js.Global().Set("parse", js.NewCallback(parse))

    select {}
}
