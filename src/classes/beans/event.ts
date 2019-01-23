import { Character } from "./character";
import { JobClass } from "./jobClass";

export class event {

    name : string;
    date : Date;
    duree : number; //in minutes
    location : any;
    description : string;
    participants : Map<Character,JobClass>;

    constructor(name : string, date : Date, duree : number, description? : string, location? : any){
        this.name = name;
        this.date = date;
        this.duree = duree;
        this.description = description;
        if (location != null){
            this.location = location;
        }
    }

    addParticipant(player : Character, role : JobClass){
        this.participants.set(player, role);
    }

    removeParticipant(player : Character){
        this.participants.delete(player);
    }

    getParticipants(){
        return this.participants.keys;
    }

    countParticipants(){
        return this.participants.size;
    }

    setLocation(location:any){
        this.location = location;
    }




}