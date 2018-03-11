.PHONY: all build clean

all: build clean

local_build:
	npm install -g grunt-cli
	npm install
	grunt ngtemplates
	npx webpack-cli --mode production

build:
	docker run -it --rm -v ${PWD}:/app -w /app --entrypoint /usr/bin/make node local_build

clean:
	rm -fr node_modules
