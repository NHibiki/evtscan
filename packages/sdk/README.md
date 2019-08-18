# evtscan-sdk

[![NHibiki](https://img.shields.io/badge/Download-Stable-39c000.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/evtscan@1.1.0/dist/evtscan.js)
[![NHibiki](https://img.shields.io/badge/Download-Lately-edb900.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/evtscan/dist/evtscan.js)
[![Docs](https://img.shields.io/badge/Read-Docs-4da1ff.svg?style=flat-square)](#)
[![NHibiki](https://img.shields.io/badge/Made%20With-%3C3-ff3000.svg?style=flat-square)](#)

## How to use

### For Browser

#### Refer to CDN

```html
<script src="https://cdn.jsdelivr.net/npm/evtscan/dist/evtscan.js"></script>
<!-- OR -->
<script src="https://unpkg.com/evtscan/dist/evtscan.js"></script>
```

#### Write your Code

```html
<script>

    const evtScan = EvtScan.new();
    // Or
    // const evtScan = new EvtScan();
    // Or [with homemade apiCaller]
    // const evtScan = new EvtScan({ endpoint: 'https://some-evtscans.io/api/' });

    // Getting information of Block / Transaction / Fungible
    const blocks = evtScan.block(); // or evtScan.transaction(), evtScan.fungible(), etc.
                                    // :EvtScan.Pager

    console.log(await blocks.next()); // it will print the first 10 blocks
    console.log(await blocks.next()); // then next 10-19[included] blocks

    const b = blocks.data[0];    // will return the 10th block since the method is called twice
    console.log(b);              // view the block
    const prev = await b.prev(); // get the previous block
    console.log(prev);           // view the block

    assert(prev instanceof EvtScan.Classes.Block); // they both belones to Block class
    const { Block } = EvtScan.Classes;
    const otherBlock = await (new Block().update(BLOCK_ID)); 
    // Or
    // const otherBlock = new Block();
    // await otherBlock.update(BLOCK_ID));

    // Get Detail by ID
    // Take nonfungible: artworks.cert as example
    const artworks = await evtScan.nonfungible('artworks.cert');
    console.log(artworks);
    
    // Searching / Getting information of Address
    const addresses = evtScan.searchAddress('EVT73Y'); // :EvtScan.Pager, get results of addresses that match this pattern
    const result = await addresses.next();
    const addr = result[0];
    console.log(addr.address); // results might differ
    // EVT73yyCz1VWKu6WsCtv31C2ifsC4Ef7Zn7WhfdYD3qtHeB8CRUPa
    await addr.update(); // get all information about this address
    console.log(addr.address);
    const { history } = addr; // :EvtScan.Pager, get transaction history
    history.pageSize = 100;
    console.log(await history.next()); // get the first 100 transactions

    // enjoy ...

</script>
```

### For Node(js/ts)

#### Install with yarn/npm

```bash
yarn add evtscan
# or
# npm install --save evtscan
```

#### Write your Code

```js
import EvtScan from 'evtscan';

const evtScan = new EvtScan();
```

Or, if you want to use your own upstream:

```js
import EvtScan, { ApiCaller } from 'evtscan';

const apiCaller = ApiCaller('https://some-evtscans.io/api/');
const evtScan = new EvtScan({ apiCaller });
// or
// const evtScan = new EvtScan({ endpoint: 'https://some-evtscans.io/api/' });
```