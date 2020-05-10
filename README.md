# KrakenDesigner
> A visual editor for the KrakenD configuration file.

An application made with AngularJS to visually create the `krakend.json` file.

[Try it live!](http://designer.krakend.io)

![Screenshot](https://github.com/devopsfaith/krakendesigner/blob/master/media/screenshot.png?raw=true)

[Download KrakenD](http://www.krakend.io/download/) | [Build KrakenD](https://github.com/devopsfaith/krakend-ce) | [Documentation](http://www.krakend.io/docs/overview/introduction/) | [Blog](http://www.krakend.io/blog)

## Usage
To use the application, it is not necessary to clone the repository. Run the following to start a web server with the KrakenDesigner:

    docker run --rm -p 8080:80 devopsfaith/krakendesigner

## Build
The build process leaves a single html file and a single JS file in the `designer` folder that is later deployed inside the KrakenD images. Build with:

### Via docker
If you have Docker this is the cleanest solution to download the dependencies, generates the js file and deletes the `node_modules` folder:

     make

### Locally with `npm`
If you don't have Docker, you can see your local `npm` to install the dependencies and build the project:

	npm install
	npm run-script build

### Testing changes
Start the web server pointing to `designer/` and mounting the volume:

    docker run --rm -d -p 8080:80 -v "$PWD/designer:/usr/share/nginx/html" devopsfaith/krakendesigner

Remember to `make build` if you change HTML, CSS or JS. Or `node_modules/.bin/grunt ngtemplates && node_modules/.bin/webpack-cli --mode production`





### Optional - Compile WASM
In case you want to compile WASM again (golang required):

    make wasm_build

## Get involved! - Please!
The application is working properly (if you find any bug please create an issue) but it needs love from frontend specialists. If you think the application needs reorganization, refactoring, webpack plugins or even a full rewrite in another framework please help us make it improve. We do know how to write go, stuff about performance, and all the boring stuff. Javascript is for decent people (and that probably leave us out), so we need you!
