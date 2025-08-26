# KrakenDesigner
> A visual editor for the KrakenD configuration file.

An application made with AngularJS to visually create the `krakend.json` file.

- [Try it live!](http://designer.krakend.io)
- [Documentation](https://www.krakend.io/docs/configuration/designer/)

## Usage
There are different ways of using the Designer:

- Use its [hosted version online](http://designer.krakend.io). Your configurations are not uploaded elsewhere.
- Run a local container: `docker run --rm -p 8000:80 krakend/designer`
- Clone the repo and build with NPM.

**Important**: Notice that when used locally, you cannot edit files as the HTML5 library used to **access local files works only under HTTPS**, but you can still download edited copies. Use Ngrok or a similar solution to serve under HTTPS locally.

The master branch of this repository is [automatically built and pushed to the online version](https://github.com/krakend/krakendesigner/blob/master/.github/workflows/deploy.yml).

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

    docker run --rm -d -p 8000:80 -v "$PWD/designer:/usr/share/nginx/html" krakend/designer

Remember to `make build` or `make watch` if you change HTML, CSS or JS.


## Get involved! - Please!
The application is working properly (if you find any bug please create an issue) but it needs love from frontend specialists. If you think the application needs reorganization, refactoring, webpack plugins or even a full rewrite in another framework please help us make it improve. We do know how to write go, stuff about performance, and all the boring stuff. Javascript is for decent people (and that probably leave us out), so we need you!
