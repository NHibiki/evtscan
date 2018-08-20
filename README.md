# EvtScan

A NG of EveriToken Explorer.

### API Entry Points

#### Get Recent Blocks

```sh
curl http://{SERVER_ADDRESS}/api/block?since={SOMETIME}&page={PAGEOFFSET}&size={PAGESIZE}
```

#### Get Recent Transactions

```sh
curl http://{SERVER_ADDRESS}/api/transaction?since={SOMETIME}&page={PAGEOFFSET}&size={PAGESIZE}
```