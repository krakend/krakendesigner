# KrakenDesigner
> A visual editor for the KrakenD configuration file.

This repository contains **two versions** of the KrakenD Designer:

## 🔴 Original Application (AngularJS - Production)
The current production application made with AngularJS to visually create the `krakend.json` file.

- [Try it live!](http://designer.krakend.io)
- [Documentation](https://www.krakend.io/docs/configuration/designer/)
- **Location:** Root folder (this directory)
- **Status:** Production application, used as reference

## 🟢 Modern Rewrite (Vue 3 - In Development)
A complete rewrite using modern technologies for better performance and maintainability.

- **Location:** `NewDesigner/` folder
- **Tech Stack:** Vue 3 + TypeScript + Tailwind CSS + Vite
- **Status:** Active development
- **Features:** JSON-first architecture, universal validation, modern UX

## Usage

### Original Application (Production)
- Use its [hosted version online](http://designer.krakend.io). Your configurations are not uploaded elsewhere.
- Run a local container: `docker run --rm -p 8000:80 krakend/designer`
- Clone the repo and build with NPM.

### Modern Rewrite (Development)
```bash
# Navigate to the new application
cd NewDesigner/

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

**Important**: Notice that when used locally, you cannot edit files as the HTML5 library used to **access local files works only under HTTPS**, but you can still download edited copies. Use Ngrok or a similar solution to serve under HTTPS locally.

The master branch of this repository is [automatically built and pushed to the online version](https://github.com/krakendio/krakendesigner/blob/master/.github/workflows/deploy.yml).

## Build

### Original Application
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

### Modern Rewrite Application
The new Vue 3 application uses Vite for building:

```bash
cd NewDesigner/

# Development build with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Development

### Contributing to the Modern Rewrite
We're actively developing a complete rewrite in `NewDesigner/` using modern technologies:

- **Vue 3 + Composition API** for reactive components
- **TypeScript** for type safety and better developer experience  
- **Tailwind CSS** for modern, utility-first styling
- **Vite** for fast development and optimized builds
- **Pinia** for state management
- **Universal validation** system with JSON schema integration

See `NewDesigner/CLAUDE.md` for detailed development instructions.

### Contributing to the Original Application
The original AngularJS application is in maintenance mode and used as reference for feature parity.
