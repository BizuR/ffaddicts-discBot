import {DiscordFormatter} from  './discordFormatter'

export class FormatterFactory{

    static getFormatter(factory_name : string){
        return new DiscordFormatter();
    }
}