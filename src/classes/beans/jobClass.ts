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

    public static cache(job : JobClass) : any {
        let parentCache = null;
        if (job.parent != null) {
            parentCache = JobClass.cache(job.parent);
        }
        return {
            id : job.id,
            name : job.name,
            type : job.type,
            abbreviation : job.abbreviation,
            icon : job.iconUrl.toString(),
            parent : parentCache
        }
    }

    public static uncache(data : any) : JobClass {
        let parentClass = null;
        if (data.parent != null){
            parentClass = JobClass.uncache(data.parent);
        }
        return new JobClass(data.id, data.name, data.abbreviation, data.type, data.icon, parentClass);
    }
}