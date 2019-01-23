export class Item{

    name : string;
    type : string;
    description : string;
    en_name : string;

    constructor(name : string, type : string, description : string, en_name : string){
        this.name = name;
        this.en_name = en_name;
        this.type = type;
        this.description = description;
    }
}