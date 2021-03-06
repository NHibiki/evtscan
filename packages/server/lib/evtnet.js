const AP = {
    "HONGKONG#1": "mainnet1",
    "TOKYO-1": "mainnet3",
    "SEOUL-1": "mainnet5",
    "SINGAPORE#1": "mainnet7",
    "KUALA#1": "mainnet9",
    "TOKYO-2": "mainnet10",
    "HONGKONG-1": "mainnet12",
    "SHANGHAI#1": "mainnet14.evtnd.com",
    "SINGAPORE#2": "mainnet15",
};

const EA = {
    "CALIFORNIA-1": "mainnet2",
    "FRANKFURT-1": "mainnet4",
    "FRANKFURT-2": "mainnet8",
    "CALIFORNIA-2": "mainnet11",
    "OHIO-1": "mainnet13",
};

const NA = {
    "BRAZIL-1": "mainnet6",
}

const CLUSTERS = {AP,EA,NA};
const NODES = {...AP, ...EA, ...NA};
const SUFFIX = ".everitoken.io";
const PROTOCOL = "https://";

let settedNode = null;
const getRandomNode = (area="") => {
    
    if (settedNode) return settedNode;
    let from = NODES;
    if (["AP", "EA", "NA"].includes(area)) from = CLUSTERS[area] || NODES;
    
    const keys = Object.keys(from);
    const n    = keys.length;
    const rand = parseInt(Math.random() * n, 10) % n; 

    let addr = from[keys[rand]];
    if (addr.indexOf('.') < 0) {
        addr += SUFFIX;
    }
    
    return {
        node: keys[rand],
        name: from[keys[rand]],
        addr: PROTOCOL + addr,
    };
    
}

const setRandomNode = node => {
    
    return settedNode = {
        node: "CUSTOM",
        name: "custom",
        addr: node
    };
    
}

module.exports = {
    CLUSTERS,
    NODES,
    SUFFIX,
    PROTOCOL,
    getRandomNode,
    setRandomNode,
}
