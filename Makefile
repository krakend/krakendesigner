.PHONY: all build clean

all: docker_build clean

local_build:
	npm install
	node_modules/.bin/grunt ngtemplates
	node_modules/.bin/webpack-cli --mode production

docker_build:
	docker run -it --rm -v ${PWD}:/app -w /app --entrypoint /usr/bin/make node local_build

clean:
	rm -fr node_modules
