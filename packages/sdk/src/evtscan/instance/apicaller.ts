export default class ApiCaller {

    private entrypoint: string = "https://evtscan.io/api";
    private timeout: number = 3000;

    static Config = {
        fetch: null as any
    };

    constructor(entrypoint?: string, timeout?: number) {

        if (entrypoint) this.entrypoint = entrypoint;
        if (timeout) this.timeout = timeout;

    }

    public queryParams(params: any): string {
        if (!params) return '';
        const res = Object.keys(params)
            .filter(k => k !== 'formatter')
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        if (!res) return '';
        return `?${res}`;
    }
    
    public async get(uri: string, params={}, headers={}) {
        const fetch = ApiCaller.Config.fetch || (typeof window !== 'undefined' && window.fetch);
        if (!fetch) {
            throw Error('Your device does not support fetch function.');
        }
        const req = await fetch(this.entrypoint +
            uri +
            this.queryParams(params), {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'User-Agent': 'EvtScanSDK v1.0',
                    ...headers
                },
                redirect: 'follow',
                referrer: 'no-referrer',
            });
        return await req.json();
    }

    public async request(uri: string, params: any = {}, key: string = "") {
        if (uri.indexOf('%%') !== -1 && key) {
            uri = uri.replace('%%', key);
        }
        const res = await this.get(uri, params);
        if (res.data && (res.state || res.status)) {
            return res.data;
        }
        return res;
    }

}