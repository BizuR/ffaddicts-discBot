import {FormatterFactory} from '../formatters/formatterFactory';
import { Url } from 'url';
import { JobClass } from './jobClass';

export class Character{

    id : string;
    name : string;
    title : string;
    portrait : Url;
    avatar : Url;
    jobs : Map<string, number>;
    attributes : Map<string, number>;
    activeJob : JobClass;

    constructor(){
        this.id = "";
        this.name = "";
        this.title = "";
        this.portrait = null;
        this.avatar = null;
        this.jobs = new Map();
        this.attributes = new Map();
        this.activeJob = null;
    }

    public addJob(newJob : JobClass, level : number) : void {
        this.jobs.set(newJob.abbreviation, level);
    }

    public addAttribute(newAttr : string, value : number) : void {
        this.attributes.set(newAttr, value);
    }

    public getLevel(job: JobClass) : number {
        return this.jobs.get(job.abbreviation);
    }

    public formatInfos(formatter_name : string) : any {
        return FormatterFactory.getFormatter(formatter_name).formatCharInfos(this);
    }

    public formatStats(formatter_name : string) : any {
        return FormatterFactory.getFormatter(formatter_name).formatStats(this);
    }

    public formatJobs(formatter_name : string) : any {
        return FormatterFactory.getFormatter(formatter_name).formatJobs(this);
    }

    public static cache(char : Character) : any {
        let attributesTab = [];
        char.attributes.forEach((value, key) => {
            attributesTab.push({attr : key, valeur : value});
        });
        let jobsTab = [];
        char.jobs.forEach((value, key) => {
            jobsTab.push({job : key, level : value});
        });
        return {
            id : char.id,
            name : char.name,
            title : char.title,
            portrait : char.portrait.toString(),
            avatar : char.avatar.toString(),
            attributes : attributesTab,
            activeJob : JobClass.cache(char.activeJob),
            jobs : jobsTab
        };
    }

    public static uncache(data : any) : Character {
        let curChar = new Character();
        curChar.id = data.id;
        curChar.name = data.name;
        curChar.title = data.title;
        curChar.portrait = data.portrait;
        curChar.avatar = data.avatar;
        curChar.activeJob = JobClass.uncache(data.activeJob);
        data.attributes.forEach(element => {
            curChar.addAttribute(element.attr, element.valeur);
        });
        data.jobs.forEach(element => {
            curChar.jobs.set(element.job, element.level);
        });
        return curChar;
    }
}