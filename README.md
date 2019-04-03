# KrakenDesigner
> A visual editor for the KrakenD configuration file.

An application made with AngularJS to visually create the `krakend.json` file.

[Try it live!](http://designer.krakend.io)

![Screenshot](https://github.com/devopsfaith/krakendesigner/blob/master/media/screenshot.png?raw=true)

[Download KrakenD](http://www.krakend.io/download/) | [Build KrakenD](https://github.com/devopsfaith/krakend-ce) | [Documentation](http://www.krakend.io/docs/overview/introduction/) | [Blog](http://www.krakend.io/blog)

## Run as Docker container
```
docker run -it --rm -p 8080:8080 devopsfaith/krakendesigner:latest
```

## Build
The build process leaves a single html file and a single JS file in the `designer` folder that is later deployed inside the KrakenD images. Build with:

### When you have docker

     make

The `node_modules` folder is deleted not leaving any trace in your machine. The cleanest option to build the files.

### When you have `npm`

    make local_build
    # Or also:
    npm run-script build

Will use your local `npm` to install and build the project.

You will need to put the files in the `designer/` folder into a web server of any kind, for instance, a PHP developer can do `php -S localhost:8081 -t designer`.

### Optional - Compile WASM
In case you want to compile WASM again:

    cd designer/wasm
    GOOS=js GOARCH=wasm go build -o main.wasm

## Get involved! - Please!
The application is working properly (if you find any bug please create an issue) but it needs love from frontend specialists. If you think the application needs reorganization, refactoring, webpack plugins or even a full rewrite in another framework please help us make it improve. We do know how to write go, stuff about performance, and all the boring stuff. Javascript is for decent people (and that probably leave us out), so we need you!
