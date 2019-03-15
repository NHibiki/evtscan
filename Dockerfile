FROM alpine:3.8

LABEL maintainer="NHibiki <i@yuuno.cc>"

WORKDIR /evtscan
COPY . .

# Build
# sed -i 's/v3.8/edge/g' /etc/apk/repositories \
RUN apk add python nodejs npm \
    && npm i -g yarn \
    && yarn \
    && cd web && yarn && yarn build \
    && cp ./static/favicon.ico ./.nuxt/dist/favicon.ico \
    && rm -rf ./node_modules

FROM alpine:3.8

WORKDIR /evtscan
COPY --from=0 /evtscan /evtscan

RUN apk add --no-cache nodejs \
    && ln -s /evtscan/web/.nuxt /evtscan/.nuxt

EXPOSE 80

ENTRYPOINT ["node", "index.js"]
