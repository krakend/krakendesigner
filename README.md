# KrakenDesigner
> A visual editor for the KrakenD configuration file.

An application made with AngularJS to visually create the `krakend.json` file.


	/**
     * Word of advice. This was coded by a backend monkey who didn't do frontend for the past 15 years.
     * The monkey went through a period of sickness after implementing the designer, but now is recovering just fine.
     * Despite everything the application works well.
     *
     * If you are a frontend by profession, I would expect no less than you have a temper and flip the table
     * when you look at the code.
     *
     * PRs are more than welcome and necessary (and even the whole app refactoring)
     */

[Try it live!](http://designer.krakend.io)

![Screenshot](media/screnshot.png)

[Download KrakenD](http://www.krakend.io/download/) | [Build KrakenD](https://github.com/devopsfaith/krakend-ce) | [Documentation](http://www.krakend.io/docs/overview/introduction/) | [Blog](http://www.krakend.io/blog)

## Build
The build process leaves a single html file and a single JS file in the `designer` folder that is later deployed inside the KrakenD images. Build with:

### When you have docker

     make

The `node_modules` folder is deleted not leaving any trace in your machine. The cleanest option to build the files.

### When you have `npm`

     make local_build

Will use your local `npm` to install and build the project.

## Get involved!
The designer is currently working properly (if you find any bug please create an issue) but it needs love from frontend specialist. If you think the application needs reorganization, refactoring, webpack plugins or even a full rewrite in another framework please help us making it improve. We do know how to write go, performance, and all the boring stuff. Javascript is for decent people (that probably leave us out). We need you!

