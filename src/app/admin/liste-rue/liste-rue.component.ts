import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-liste-rue',
  templateUrl: './liste-rue.component.html',
  styleUrls: ['./liste-rue.component.css']
})
export class ListeRueComponent implements OnInit {
  loading=false;rues=[];
  requestPage:RequestPage;
  quartiers;

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    this.httpService.post("requestSql", Requetes.listeQuartiers)
                          .subscribe(data=>this.quartiers=data);
    this.requestPage= new RequestPage(Requetes.listeRues);
    this.loadPage();
    window.onscroll=()=>this.detectBottom();
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
      .subscribe(data =>{
        console.log(data)
        if(data.length){
          this.rues.push(...data);
        }
        else{
          this.requestPage.loadedAll=true;
        }  
        this.loading=false;
      });
  }

  rechercher(form){
    this.rues=[];
    let reqSql=Requetes.listeRues;
    let where=" Where";
    if (form.codeRivoli != "") where += " and codeRivolie='" + form.codeRivoli + "'";
    if (form.adresse != "") where += " and (concat(prefixe,' ',liaison,' ',nomrue) like '%" + form.adresse.replace("'","''") + "%' OR"+
                                     " concat(prefixe,' ',nomrue) like '%" + form.adresse.replace("'","''") + "%')";
    if (form.quartier != "") where += " and nomquartier='"+form.quartier+"'";
    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 6) reqSql += where;
    console.log(form,reqSql);
    this.requestPage= new RequestPage(reqSql);
    this.loadPage();
  }
  //Détecte le curseur arrive à la fin du contenu
  detectBottom(): void {
    console.log("scrool",window.innerHeight+window.scrollY,document.body.offsetHeight)
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      console.log("OKKKKK!!!!!")
      if (!this.requestPage.loadedAll) {
        this.requestPage.paginate();
        this.loadPage();
      }
    }
  }
}
