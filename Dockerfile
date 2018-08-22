FROM alpine:3.8

WORKDIR /evtscan
COPY . .

# Build Server Side
RUN sed -i 's/v3.8/edge/g' /etc/apk/repositories \
    && apk add --no-cache nodejs=8.11.4-r0 \
    && apk add --no-cache npm=8.11.4-r0 \
    && rm -rf ./node_modules \
    && npm i -g yarn \
    && yarn

# Build Client Side
RUN cd web \
    && yarn \
    && npm run build \
    && cd ..

EXPOSE 80
ENTRYPOINT ["yarn", "start"]
