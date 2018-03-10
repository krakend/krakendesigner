# KrakenDesigner
> A visual editor for the KrakenD configuration file.

An application made in AngularJS.


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

## Build
The build process leaves a single html file and a single JS file in the `designer` folder that is later deployed inside the KrakenD images. Build with:

	make build

The `node_modules` folder is deleted not leaving any trace in your machine.
