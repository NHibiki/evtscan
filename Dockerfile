FROM alpine:3.8

LABEL maintainer="NHibiki <i@yuuno.cc>"

WORKDIR /evtscan
COPY . .

# Build
# sed -i 's/v3.8/edge/g' /etc/apk/repositories \
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && apk add python nodejs npm make g++ \
RUN apk add python nodejs npm make g++ \
    && npm config set unsafe-perm true \
    && npm i -g yarn \
    && yarn install \
    && yarn plugin-build \
    && cd packages/frontend && yarn build \
    && cp ./static/favicon.ico ./.nuxt/dist/favicon.ico

FROM alpine:3.8

WORKDIR /evtscan/packages/server
COPY --from=0 /evtscan /evtscan

# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && apk add --no-cache nodejs \
RUN apk add --no-cache nodejs \
    && ln -s /evtscan/packages/frontend/.nuxt /evtscan/packages/server/.nuxt

EXPOSE 80

ENTRYPOINT ["node", "index.js"]
