import { Url } from "url";
import * as moment from 'moment';
import 'moment/locale/fr';

export class FFEvent {

    name : string;
    date : moment.Moment;
    duree : number; //in minutes
    dateFin : moment.Moment;
    location : any;
    description : string;
    participants : Map<String,String>;

    constructor(name : string, date : string, duree : number, description? : string, location? : any){
        this.name = name;
        this.date = moment(date, 'DD/MM/YYYY HH:mm', true);
        this.duree = duree;
        this.dateFin = this.date.clone().add(duree, 'minutes');
        this.description = description;
        if (location != null){
            this.location = location;
        }
        this.participants = new Map();
    }

    addParticipant(player : String, role : string){
        this.participants.set(player, role);
    }

    removeParticipant(player : String){
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

    public static cache(event : FFEvent) : any {
        
        let playersTab = [];
        event.participants.forEach((value, key) => {
            playersTab.push({player : key, role : value});
        });
        return {
            name : event.name,
            date : event.date.format('DD/MM/YYYY HH:mm'),
            duree : event.duree,
            description : event.description,
            location : event.location,
            participants : playersTab
        };     
    }

    public static uncache(data : any) : FFEvent {
        console.log(data);
        let curEvent = new FFEvent(data.name, data.date, data.duree, data.description, data.location);
        data.participants.forEach(element => {
            curEvent.addParticipant(element.player, element.role);
        });
        console.log(curEvent);
        return curEvent;
    }

    public getGCalendarLink() : Url {
        let urlevent = new URL("http://www.google.com/calendar/event");
        urlevent.searchParams.append("action", "TEMPLATE");
        let datedebut = this.date.format("YYYYMMDD\THHmmssz");
        let datefin = this.dateFin.format("YYYYMMDD\THHmmssz");
        urlevent.searchParams.append("dates", datedebut + "/" + datefin);
        urlevent.searchParams.append("text", this.name);
        if (this.location != null)
            urlevent.searchParams.append("location", this.location);
        if (this.description != null)
            urlevent.searchParams.append("description", this.description);
        return urlevent;
    }
}