import { Component, OnInit } from '@angular/core';
import { Requetes } from '../../models/Requetes';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-liste-taxe',
  templateUrl: './liste-taxe.component.html',
  styleUrls: ['./liste-taxe.component.css']
})
export class ListeTaxeComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  baremes;taxes=[];
  
  constructor(private httpService:HttpService,
              private dataService: DataService) {}

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    let requete=this.dataService.requete_list_taxes?this.dataService.requete_list_taxes:Requetes.listeTaxes;
    this.requestPage=new RequestPage(requete)
    this.loadPage();
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        this.taxes.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });

  }

  rechercher(form){
    this.taxes=[];
    let reqSql=Requetes.listeTaxes;
    let where=" Where";
    if (form.annee != "") where += " and i.id.anneeExercice='" + form.annee+"'";
    if (form.typeTaxe != "") where += " and i.id.idImputation=" + form.typeTaxe;
    if (form.libelle != "") where += " and i.libelle like '%" + form.libelle + "%'";
    if (form.codeTri != "") where += " and i.code like '"+form.codeTri+"%'";
    if (form.envBuget != "") where += " and i.section like '%"+form.envBuget+"%'";
    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 6) reqSql += where;
    this.dataService.requete_list_taxes=reqSql;
    this.requestPage=new RequestPage(reqSql)
    this.loadPage();
  }
  //Détecte le curseur arrive à la fin du contenu
  detectBottom(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (!this.requestPage.loadedAll) {
        this.requestPage.paginate();
        this.loadPage();
      }
    }
  }
}
