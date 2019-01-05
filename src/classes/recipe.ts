import {FormatterFactory} from './formatterFactory';
import { Url } from 'url';
import {Item} from './item';
import { JobClass } from './jobClass';

export class Recipe{

    id : string;
    name : string;
    difficulty : number;
    durability : number;
    quality : number;
    ingredients : Map<Item,number>;
    job : JobClass;
    levelRequired : number;
    craftType : string;
    iconUrl : Url;

    constructor(){
        this.id = "";
        this.name = "";
        this.difficulty = 0;
        this.durability = 0;
        this.quality = 0;
        this.ingredients = new Map();
        this.job = null;
        this.levelRequired = 0;
    }

    public addIngredient(item : Item, quantity : number) : void {
        this.ingredients.set(item, quantity);
    }

    public formatRecipe(formatter_name : string) : any {
        return FormatterFactory.getFormatter(formatter_name).formatRecipe(this);
    }
    
}