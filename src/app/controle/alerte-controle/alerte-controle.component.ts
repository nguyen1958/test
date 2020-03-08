import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-alerte-controle',
  templateUrl: './alerte-controle.component.html',
  styleUrls: ['./alerte-controle.component.css']
})
export class AlerteControleComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  alertes=[];
  
  typeTaxes=['TAV','DDV','INFRACTION','PUBLICITE'];
  lieDossiers=['SansDossier','SurDossier'];
  etats=['EN COURS','CLOTURES'];
  quartiers;
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    this.httpService.post("requestSql", Requetes.listeQuartiers).subscribe(data=>this.quartiers=data);
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        this.alertes.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });

  }

  rechercher(form){
    this.alertes=[];
    let requete=`select distinct new map(al as alerte,a as article,e as emplacement,r as redevable,i as taxe,c as controleur) 
    from Alerte al
    left join Article a on al.idArticle=a.idArticle
    left join ElementFacturation ef on a.idElementFacturation=ef.numero
    left join EmplacementShort e on e.numero=ef.numeroEmplacement
    left join ImputationShort i on i.id.idImputation=e.codeType	and i.id.anneeExercice=e.anneeExerciceImputation
    left join Utilisateur c on c.numeroUser=al.id_controleur
    left join RedevableShort r on r.numRedevable=e.numRedevable	`;
    let where=" Where";
    let date=form.date?form.date.toLocaleDateString():"";
    if (form.typeTaxe!="") where+=" and i.libelle='"+form.typeTaxe+"'";
    if (date != "") where += " and al.date_creation='" + date +"'";
    if (form.nomControleur != "") where += " and CONCAT(c.prenom,' ',c.nom) like '%" + form.controleur+"%'";
    if (form.nomRedevable != "") where += " and CONCAT(r.nomRedevable,' ',r.prenom) like '%" + form.nomRedevable+"%'";
    if (form.etat!="") where+=" and al.etatAlerte='"+form.etat+"'";
    if (form.quartier!="") where+=" and al.quartier='"+form.quartier+"'";
    if (form.numRue!="") where+=" and e.numrue='"+form.numRue+"'";
    if (form.nomRue != "") where += " and e.adresse1 like '%" + form.nomRue+"%'";

    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 6) requete += where;
    requete+=" ORDER BY al.id DESC";
    this.requestPage=new RequestPage(requete)
    this.loadPage();
  }

  getContent(key,data){
    switch(key){
      case "redevable":
        return data.redevable?`<a [routerLink]="['../Création d\'un redevable',{numRedevable:data.redevable.numRedevable}]">
        {{data.redevable.nomRedevable+" "+data.redevable.prenom}}</a>`:"-"
      case "article":
        return data.article?`<a [routerLink]="['../Modification ouvrage',{id:data.article.idArticle}]">
        {{data.article.nom.startsWith("#")?"Non precise":data.article.nom}}</a>`:"-"
    }

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
