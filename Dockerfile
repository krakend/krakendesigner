##
# BUILDER
##

FROM node:11.12-alpine as builder

WORKDIR /app

COPY package-lock.json package-lock.json
COPY package.json package.json
RUN npm install

COPY *.js ./
COPY src/ src/
RUN npm run build

##
# RUNNER (serve static files)
##

FROM halverneus/static-file-server:v1.6.3 AS runner

COPY --from=builder /app/designer/ /web/

# the CMD of the container serves the /web folder