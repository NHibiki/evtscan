FROM alpine:3.8
MAINTAINER NHibiki<i@yuuno.cc>

WORKDIR /evtscan
COPY . .

# Build Server Side
# sed -i 's/v3.8/edge/g' /etc/apk/repositories \
RUN apk add --no-cache python nodejs npm \
    && rm -rf ./node_modules \
    && npm i -g yarn \
    && yarn \
# Build Client Side
    && cd web \
    && rm -rf ./node_modules \
    && yarn \
    && yarn build \
    && cp ./static/favicon.ico ./.nuxt/dist/favicon.ico \
    && cd .. \
# Clean Out
    && cd web \
    && rm -rf ./node_modules \
    && cd .. \
    && npm un -g yarn \
    && apk del python npm \
    && rm -rf /usr/local/share/.cache \
    && ln -s ./web/.nuxt ./.nuxt

EXPOSE 80
ENTRYPOINT ["node", "index.js"]
