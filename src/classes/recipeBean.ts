import {FormatterFactory} from './formatterFactory';
import { Url } from 'url';
import {Item} from './itemBean';
import { JobClass } from './jobClassBean';

export class Recipe{

    id : string;
    name : string;
    difficulty : number;
    durability : number;
    quality : number;
    ingredients : IngredientForRecipe[];
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
        this.ingredients = [];
        this.job = null;
        this.levelRequired = 0;
    }

    //accesseurs
 /*   get id(){return this.id;}
    get name(){return this.name;}
    get difficulty(){return this.difficulty;}
    get durability(){return this.durability;}
    get quality(){return this.quality;}
    get ingredients(){return this.ingredients;}
    get job(){return this.job;}
    get levelrequired(){return this.levelrequired;}
    set id(newid){this.id=newid;}
    set name(newname){this.name=newname;}
    set difficulty(newdifficulty){this.difficulty=newdifficulty;}
    set durability(newdurability){this.durability=newdurability;}
    set quality(newquality){this.quality=newquality;}
    set ingredients(newingredients){this.ingredients=newingredients;}
    set job(newjob){this.job=newjob;}
    set levelrequired(newlevelrequired){this.levelrequired=newlevelrequired;}*/

    public addIngredient(newIngredientForRecipe : IngredientForRecipe){
        this.ingredients.push(newIngredientForRecipe);
    }

    public formatRecipe(formatter_name : string){
        return FormatterFactory.getFormatter(formatter_name).formatRecipe(this);
    }
    
}

export class IngredientForRecipe{

    recipeID : string;
    quantity : number;
    item : Item;

    constructor(recipeID : string,quantity : number,item : Item){
        this.recipeID = recipeID;
        this.quantity = quantity;
        this.item = item;
    }
}