export class Utils {
    
    public static upperCaseFirst(chaine : string) : string { 
        return chaine.substr(0,1).toUpperCase + chaine.substring(1);
    }
}