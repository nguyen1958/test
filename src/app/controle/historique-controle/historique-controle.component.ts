import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-historique-controle',
  templateUrl: './historique-controle.component.html',
  styleUrls: ['./historique-controle.component.css']
})
export class HistoriqueControleComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  controles=[];
  quartiers;controleurs;
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    this.httpService.post("requestSql", Requetes.listeQuartiers).subscribe(data=>this.quartiers=data);
    this.httpService.post("requestSql", Requetes.controleurs).subscribe(data=>this.controleurs=data);
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        this.controles.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });

  }

  rechercher(form){
    let requete=`select distinct new map(hc as controle,c as controleur,r.nomquartier as quartier) 
    from HistoriqueControle hc
    left join Article a on hc.idOuvrage=a.idArticle
    left join ElementFacturation ef on a.idElementFacturation=ef.numero
    left join EmplacementShort e on e.numero=ef.numeroEmplacement
    left join Rue r on r.codeVoie=e.codeVoie
    left join Utilisateur c on c.numeroUser=hc.idControleur `;
    let where=" Where";
    let date=form.date?form.date.toLocaleDateString():"";
    if (date != "") where += " and hc.dateControle='" + date +"'";
    if (form.idControleur != "") where += " and hc.idControleur=" + form.idControleur;
    if (form.quartier!="") where+=" and r.nomquartier='"+form.quartier+"'";

    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 6) requete += where;
    requete+=" ORDER BY hc.id DESC";
    this.requestPage=new RequestPage(requete)
    this.loadPage();
  }

  getContent(type){
    switch(type){
      case "ST":return "Synchronisation totale";  
      case "SP":return "Synchronisation partielle"; 
      default:return "-";
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
