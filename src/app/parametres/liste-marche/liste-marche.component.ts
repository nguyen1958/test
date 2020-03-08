import { Component, OnInit } from '@angular/core';
import { Requetes } from '../../models/Requetes';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-liste-marche',
  templateUrl: './liste-marche.component.html',
  styleUrls: ['./liste-marche.component.css']
})
export class ListeMarcheComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  marches=[];
  
  constructor(private httpService:HttpService) { }

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    this.requestPage=new RequestPage(Requetes.listeMarches);
    this.loadPage();
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        this.marches.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });
  }

  rechercher(form){
    this.marches=[];
    let reqSql="select distinct m from Marche m ";
    let where="Where";
    if (form.code != "") where += " and m.idMarche=" + form.code;
    if (form.libelle != "") where += " and m.nomMarche like '%" + form.libelle + "%'";
    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 5) reqSql += where;
    this.requestPage=new RequestPage(reqSql)
    this.loadPage();
  }

  detectBottom(): void {
    if(this.requestPage){
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!this.requestPage.loadedAll) {
          this.requestPage.paginate();
          this.loadPage();
        }
      }
    }   
  }  

}
