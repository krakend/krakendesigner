.PHONY: all build clean

all: build clean

build:
	docker run -it --rm -v ${PWD}:/app -w /app node:alpine npm install -g grunt-cli && npm install && grunt ngtemplates && npx webpack-cli --mode production

clean:
	rm -fr node_modules
