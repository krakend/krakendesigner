.PHONY: all install watch docker_build clean create_image serve

all: install clean

# Installs the dependencies and generates the JS bundle
install:
	docker run --rm -it -v "${PWD}:/app" -w /app node:12 sh -c 'npm install && npm run-script build'

# Watches SCSS and JS for changes
watch:
	docker run --rm -it -v $PWD:/app -w /app node:12 npm run-script watch

build:
	docker run --rm -it -v "${PWD}:/app" -w /app node:12 npm run-script build

# Build the image
docker_build:
	docker build -t devopsfaith/krakendesigner .

wasm_build:
	cd designer/wasm && GOOS=js GOARCH=wasm go build -o main.wasm && cd ..

serve:
	docker run --rm -d -p 8080:80 -v "${PWD}/designer:/usr/share/nginx/html" devopsfaith/krakendesigner

clean:
	rm -fr node_modules

# Create the official docker image
create_image: install docker_build clean
