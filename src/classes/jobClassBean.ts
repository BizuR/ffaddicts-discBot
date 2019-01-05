import { Url } from "url";

export class JobClass{

    name : string;
    type : string;
    iconUrl : Url;

    constructor(name : string, type : string, iconUrl : Url){
        this.name = name;
        this.type = type;
        this.iconUrl = iconUrl;
    }
}