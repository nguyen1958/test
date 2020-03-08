import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-recherche-refacturation',
  templateUrl: './recherche-refacturation.component.html',
  styleUrls: ['./recherche-refacturation.component.css']
})
export class RechercheRefacturationComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  historiqueRefacturations=[];
  typeTaxes;
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }
  constructor(private httpService:HttpService) { }

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    this.httpService.post("requestSql", Requetes.taxes)
        .subscribe(data=>this.typeTaxes=data);
  }

  rechercher(form){
    this.historiqueRefacturations=[];
    let requete=`FROM HistoriqueRefacturation`;
    let where=" Where etape='refacturation' ";
    let date=form.date?form.date.toLocaleDateString():"";
    if (form.typeTaxe!="") where+=" and typeTaxe='"+form.typeTaxe+"'";
    if (date != "") where += " and dateRefacturation='" + date +"'";
    if (form.numRedevable != "") where += " and numRedevable="+form.numRedevable;
    if (form.numeroFacture!="") where+=" and numeroFacture="+form.numeroFacture;
    if (form.annee!="") where+=" and anneeExercice='"+form.annee;
    requete += where+" ORDER BY id DESC"
    this.loading=true;
    this.requestPage= new RequestPage(requete);
    this.loadPage();
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        this.historiqueRefacturations.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });

  }

  detectBottom(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (!this.requestPage.loadedAll) {
        this.requestPage.paginate();
        this.loadPage();
      }
    }
  }  
}
