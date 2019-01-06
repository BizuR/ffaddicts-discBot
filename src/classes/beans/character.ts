import {FormatterFactory} from '../formatters/formatterFactory';
import { Url } from 'url';
import { JobClass } from './jobClass';

export class Character{

    id : string;
    name : string;
    title : string;
    portrait : Url;
    avatar : Url;
    jobs : Map<JobClass, number>;
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
        this.jobs.set(newJob, level);
    }

    public addAttribute(newAttr : string, value : number) : void {
        this.attributes.set(newAttr, value);
    }

    public getLevel(job: JobClass) : number {
        return this.jobs.get(job);
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

    
}