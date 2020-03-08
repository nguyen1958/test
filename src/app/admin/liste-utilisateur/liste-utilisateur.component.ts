import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-liste-utilisateur',
  templateUrl: './liste-utilisateur.component.html',
  styleUrls: ['./liste-utilisateur.component.css']
})
export class ListeUtilisateurComponent implements OnInit {
  utilisateurs=[];
  requestPage:RequestPage;
  typeUtilisateurs;

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    this.httpService.post("requestSql", Requetes.listevaleursByType('type_utilisateur'))
                          .subscribe(data=>this.typeUtilisateurs=data);
    this.requestPage=new RequestPage(Requetes.listeUtilisateurs)
    this.loadPage();
  }

  loadPage(){
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      //console.log(data)
      if(data.length){
        this.utilisateurs.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
    });

  }

  rechercher(form){
    this.utilisateurs=[];
    let reqSql=Requetes.listeUtilisateurs;
    let where=" Where";
    if (form.code != "") where += " and numeroUser=" + form.code;
    if (form.nom != "") where += " and nom like '%" + form.nom + "%'";
    if (form.prenom != "") where += " and prenom like '"+form.prenom+"%'";
    if (form.type != "") where += " and ensembleUtilisateur = '"+form.type+"'";
    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 6) reqSql += where;
    this.requestPage=new RequestPage(reqSql);
    this.loadPage();
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
