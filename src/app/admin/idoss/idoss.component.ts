import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-idoss',
  templateUrl: './idoss.component.html',
  styleUrls: ['./idoss.component.css']
})
export class IdossComponent implements OnInit {
  loading=false;requete;
  requestPage:RequestPage;
  idoss=[];
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        this.idoss.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });

  }

  rechercher(form){
    this.idoss=[];
    this.requete=`select o from BatchRapprochementIdoss o`;
    let where=" Where";
    let date=form.date?form.date.toLocaleDateString():"";
    if (date != "") where += " and o.dateLancement like '%" + date +"%'";
    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 6) this.requete += where;
    this.requete+=" ORDER BY o.id DESC";
    this.requestPage= new RequestPage(this.requete)
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
