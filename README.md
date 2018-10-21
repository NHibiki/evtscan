# EvtScan
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FNHibiki%2Fevtscan.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FNHibiki%2Fevtscan?ref=badge_shield)


A NG of [EveriToken](https://everitoken.io) Explorer.

### Docker Build

#### Build The Server

```sh
docker build . -t nhibiki/evtscan
```

or you can directly pull the latest image from docker hub.

```sh
docker pull nhibiki/evtscan
```

#### Run The Server

```sh
docker run --rm -it nhibiki/evtscan -a 0.0.0.0 -m mongodb://{YOUR_MONGO_SERVER_IP}:{YOUR_MONGO_SERVER_PORT}
```

Now, you can get access to `http://172.17.0.x` if you run docker on `linux` or `docker-machine` for both `windows` and `mac`. (`x` indicates for the number of docker instance you are running. For example, if it is my first time run docker image, then `x = 2`. The URL should be `http://172.17.0.2`)

Also, you can definitely proxy the port out to host machine. :)

### API Entry Points

#### Get Recent Blocks

```sh
curl http://{SERVER_ADDRESS}/api/block?since={SOMETIME}&page={PAGEOFFSET}&size={PAGESIZE}
```

#### Get Recent Transactions

```sh
curl http://{SERVER_ADDRESS}/api/transaction?since={SOMETIME}&page={PAGEOFFSET}&size={PAGESIZE}
```

#### Get Details

```sh
curl http://{SERVER_ADDRESS}/api/{ZONE}
```

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FNHibiki%2Fevtscan.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FNHibiki%2Fevtscan?ref=badge_large)