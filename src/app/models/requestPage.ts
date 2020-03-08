export class RequestPage{

    public loadedAll:boolean=false;
    public page:number=0;

    constructor(public req:string,public size?:number){}

    public reset(){
        this.page=0;
    }

    public paginate(){
        this.page++;
    }

}