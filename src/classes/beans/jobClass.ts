import { Url } from "url";

export class JobClass{

    id : number
    name : string;
    type : string;
    abbreviation : string;
    iconUrl : Url;
    parent : JobClass;

    constructor(id : number, name : string, abbreviation : string, type : string, iconUrl : Url, parent? : JobClass){
        this.name = name;
        this.type = type;
        this.iconUrl = iconUrl;
        this.abbreviation = abbreviation;
        if (parent != null) {
            this.parent = parent;
        }
    }
}