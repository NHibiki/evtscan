FROM alpine:3.8
MAINTAINER NHibiki<i@yuuno.cc>

WORKDIR /evtscan
COPY . .

# Build Server Side
RUN sed -i 's/v3.8/edge/g' /etc/apk/repositories \
    && apk add --no-cache python nodejs=8.11.4-r0 \
    && apk add --no-cache npm=8.11.4-r0 \
    && rm -rf ./node_modules \
    && npm i -g yarn \
    && yarn \
# Build Client Side
    && cd web \
    && rm -rf ./node_modules \
    && yarn \
    && npm run build \
    && cd .. \
# Clean Out
    && cd web \
    && rm -rf ./node_modules \
    && cd .. \
    && npm un -g yarn \
    && apk del python npm \
    && rm -rf /usr/local/share/.cache

EXPOSE 80
ENTRYPOINT ["node", "index.js"]
