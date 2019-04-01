.PHONY: all build clean

all: docker_build clean

local_build:
	npm install
	npm run-script build

docker_build:
	docker run -it --rm -v ${PWD}:/app -w /app --entrypoint /usr/bin/make node local_build

wasm_build:
	cd designer/wasm && GOOS=js GOARCH=wasm go build -o main.wasm && cd ..

clean:
	rm -fr node_modules
