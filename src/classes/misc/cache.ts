import * as LRU from 'lru-cache';
const pCache = require('persistent-cache');

export class IMCache {

    cache : any;
    cacheOptionsData: any;

    constructor(maxObjects : number, maxSize? : number, ttl? : number){
        this.cacheOptionsData = {};
        this.cacheOptionsData.max = maxSize!=null ? maxSize : 100;
        this.cacheOptionsData.maxAge = ttl != null ? ttl : 60 * 60 * 1000;
        this.cache = new LRU(this.cacheOptionsData);
    }

    put(key : string, value : any) : void{
        this.cache.set(key,value);
    }

    get(key:string):any{
        return this.cache.get(key);
    }

    exists(key:string):boolean{
        return this.cache.has(key);
    }
}

export class HACache {
    
    cache : any;

    constructor(path : string, id : string){
       this.cache = pCache({
            base: path,
            name: id
        });
    }

    put(key : string, value : any) : void{
        this.cache.putSync(key,value);
    }

    get(key:string):any{
        return this.cache.getSync(key);
    }

    exists(key:string):boolean{
        try{
            this.cache.getSync(key);
            return true;
        }
        catch(err){return false;}
    }

    keys() : string[] {
        return this.cache.keysSync();
    }
}