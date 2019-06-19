.PHONY: all install watch docker_build clean create_image

all: install clean

# Installs the dependencies and generates the JS bundle
install:
	docker run --rm -it -v "${PWD}:/app" -w /app node:10 sh -c 'npm install && npm run-script build'

# Watches SCSS and JS for changes
watch:
	docker run --rm -it -v $PWD:/app -w /app node:10 npm run-script watch

build:
	docker run --rm -it -v "${PWD}:/app" -w /app node:10 npm run-script build

# Build the image
docker_build:
	docker build -t devopsfaith/krakendesigner .

wasm_build:
	cd designer/wasm && GOOS=js GOARCH=wasm go build -o main.wasm && cd ..

clean:
	rm -fr node_modules

# Create the official docker image
create_image: install docker_build clean