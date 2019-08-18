import * as Package from './main';

const { EvtScan } = Package;

Object.keys(Package)
    .filter(k => k !== 'EvtScan' && k !== 'default')
    .forEach(k => {
        (EvtScan as any)[k] = (Package as any)[k];
});

export default EvtScan;