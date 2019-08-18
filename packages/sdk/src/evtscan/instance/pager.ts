import ApiCaller from './apicaller';

export interface PagerConfig {
    since?: string;
    from?: string;
    page?: number;
    size?: number;
    keyword?: string; // for address only
    formatter?: (pager: Pager, data: any) => any; // do data format
}

export default class Pager {

    public pageSize: number = 20;
    public pageOffset: number = -1;
    public data: any;
    public apiCaller: ApiCaller;

    public readonly uri: string;
    public readonly key: string;

    private pageData: any = [];
    private config: PagerConfig;
    private formatter: (pager: Pager, data: any) => any;
    
    public constructor(uri:string, config?: PagerConfig, key?: string | null, apiCaller?: ApiCaller) {
        this.uri = uri;
        if (key) this.key = key;
        if (apiCaller) {
            this.apiCaller = apiCaller;
        } else {
            this.apiCaller = new ApiCaller();
        }
        if (!config) return;
        if (config.page) this.pageOffset = config.page - 1;
        if (config.size) this.pageSize = config.size;
        if (config.formatter) this.formatter = config.formatter;
        this.config = config;
    }

    private async getPageData() {
        if (this.pageData[this.pageOffset]) {
            return this.pageData[this.pageOffset];
        }
        this.pageData[this.pageOffset]
            = this.data
            = await this.apiCaller.request(this.uri, {
                ...this.config,
                page: this.pageOffset,
                size: this.pageSize
            }, this.key || '');
        
        if (this.formatter) {
            if (this.data.length && this.data.forEach) {
                this.data.forEach((v: any, i: number) => {
                    this.data[i] = this.formatter(this, v);
                });
            } else {
                this.pageData[this.pageOffset]
                    = this.data
                    = this.formatter(this, this.data);
            }
        }

        return this.data;
    }

    public async prev() {
        return await this.page(this.pageOffset - 1);
    }

    public async next() {
        return await this.page(this.pageOffset + 1);
    }

    public async page(p: number) {
        if (p < 0 || parseInt(`${p}`, 10) !== p) {
            p = this.pageOffset;
        }
        this.pageOffset = p;
        return await this.getPageData();
    }

}