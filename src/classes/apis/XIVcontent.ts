import { JobClass } from '../beans/jobClass';
import { Utils } from '../misc/utils';
import { XIVrequester } from './XIVrequestBuilder';
import { IMCache } from '../misc/cache';

const props = require(process.cwd() + "/" + process.argv[2]);
const xivapi_baseurl = props.xivApi.baseUrl;
const cache: any = new IMCache(500);

export class XIVcontent {

    public static async getTitle(title : number, gender: number) : Promise<string> {
        let titleInfo = await XIVrequester.getContent('Title', title);
        return gender === 1 ? titleInfo.Name : titleInfo.NameFemale;
    }

    public static async loadJobClasses() : Promise<Map<number,JobClass>> {
        //if in cache
        if (cache.exists('jobClasses')) {return cache.get('jobClasses');}
        //api search
        else {
            let jobList = await XIVrequester.getContent('ClassJob', null, new Map([['columns', 'ID,Name,Icon,Abbreviation,ClassJobCategory.Name']]));
            let jobs : Map<number,JobClass> = new Map();
            for (let i = 0;i < jobList.Pagination.Results; i++) {
                let curEntry = jobList.Results[i];
                if (curEntry.Name != ''){
                    let curJob = new JobClass(curEntry.ID, Utils.upperCaseFirst(curEntry.Name), curEntry.Abbreviation , Utils.upperCaseFirst(curEntry.ClassJobCategory.Name), new URL(xivapi_baseurl + curEntry.Icon));
                    jobs.set(curEntry.ID,curJob);
                    cache.put('jobClass-'+curEntry.ID,curJob);
                }
            }
            cache.put('jobClasses', jobs);
            return jobs;
        }
    }

    public static async getJobClass(id : number) : Promise<JobClass> {
        //if in cache
        if (cache.exists('jobClass-'+id)) {
            return cache.get('jobClass-'+id);
        }
        //api search
        else {
            let jobInfo = await XIVrequester.getContent('ClassJob', id);
            let jobResponse : JobClass = new JobClass(jobInfo.ID, Utils.upperCaseFirst(jobInfo.Name), jobInfo.Abbreviation, Utils.upperCaseFirst(jobInfo.ClassJobCategory.Name), new URL(xivapi_baseurl + jobInfo.Icon));
            cache.put('jobClass-'+id, jobResponse);
            return jobResponse;
        }
    }

    public static async loadAttributes() : Promise<Map<number,string>> {
        //if in cache
        if (cache.exists('attributes')) {
            return cache.get('attributes');
        }
        //api search
        else {
            let attrList = await XIVrequester.getContent('BaseParam');
            let attributes : Map<number,string> = new Map();
            for (let i = 0;i < attrList.Pagination.Results; i++) {
                attributes.set(attrList.Results[i].ID,attrList.Results[i].Name);
                cache.put('attr-'+attrList.Results[i].ID, attrList.Results[i].Name);
            }
            cache.put('attributes', attributes);
            return attributes;
        }
    }

}