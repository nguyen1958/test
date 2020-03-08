import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-historique-tache',
  templateUrl: './historique-tache.component.html',
  styleUrls: ['./historique-tache.component.css']
})
export class HistoriqueTacheComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  taxes;
  historiqueActions=[];
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    this.httpService.post("requestSql",Requetes.taxes)
      .subscribe(data=>this.taxes=data)
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        this.historiqueActions.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });

  }

  rechercher(form){
    this.historiqueActions=[];
    let requete=`select o from HistoriqueAction o `;
    let where=" Where";
    let date=form.date?form.date.toLocaleDateString():"";
    let action=form.action;
    if (date != "") where += " and o.date like '%" + date +"%'";
    if (form.taxe != "") where += " and o.action like '%" + form.taxe+"%'";
    if (form.motclef != "") where += " and o.action like '%" + form.motclef+"%'";
    if(action.length>0){
        if (action.includes('photo')) where += " and o.action like '%image%'";
        else
        if(action=="Bascule") where += " and o.action like '%bascule%'";
        else
        if(action=="Lancement de batch") where += " and o.action like '%Lancement du batch%'";
        else
        if(action=="Changement de l'adresse du redevable") where += " and o.action like '%Changement de l''adresse du redevable%'";
    }
    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 6) requete += where;
    requete+=" ORDER BY o.id DESC";
    this.requestPage= new RequestPage(requete);
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
