.PHONY: all build

all: build

build:
	docker run -it --rm -v "$PWD":/app -w /app node:alpine npm install && grunt ngtemplates && npx webpack-cli --mode production
	rm -fr node_modules
