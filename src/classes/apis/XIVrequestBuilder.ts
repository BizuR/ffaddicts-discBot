import fetch from 'node-fetch';

const props = require(process.cwd() + "/" + process.argv[2]);
const baseurl : string = props.xivApi.baseUrl;
const endRequest : string = "language="+props.xivApi.language+"&key="+props.xivApi.secretKey;

export class XIVrequester {

    public static async getContent(contentType : string, id? : number, options? : Map<string, string>) {
        //url building
        let current_url = baseurl + '/' + contentType;
        if (id != null){ current_url += '/' + id;}
        current_url += '?';
        if (options != null){
            options.forEach((value: string, key: string) => {
                current_url += key + "=" + encodeURIComponent(value) + '&';
            });
        }
        current_url += endRequest;
        // fetching url
        let response = await fetch(current_url);
        return await response.json();
    }

    public static async searchContent(contentType : string, name : string, options? : Map<string, string>) {
        //url building
        let current_url = baseurl + '/search?indexes=' + encodeURIComponent(contentType)+"&string="+encodeURIComponent(name)+'&';
        if (options != null){
            options.forEach((value: string, key: string) => {
                current_url += key + "=" + encodeURIComponent(value) + '&';
            });
        }
        current_url += endRequest;
        // fetching url
        let response = await fetch(current_url);
        return await response.json();
    }

    public static async searchCharacter(server : string, name : string, options? : Map<string, string>) {
        //url building
        let current_url = baseurl + '/character/search?server=' + encodeURIComponent(server)+"&name="+encodeURIComponent(name)+'&';
        if (options != null){
            options.forEach((value: string, key: string) => {
                current_url += key + "=" + encodeURIComponent(value) + '&';
            });
        }
        current_url += endRequest;
        // fetching url
        let response = await fetch(current_url);
        return await response.json();
    }
}
