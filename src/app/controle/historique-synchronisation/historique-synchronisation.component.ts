import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-historique-synchronisation',
  templateUrl: './historique-synchronisation.component.html',
  styleUrls: ['./historique-synchronisation.component.css']
})
export class HistoriqueSynchronisationComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  synchronisations=[];
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
        this.synchronisations.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });

  }

  rechercher(form){
    this.synchronisations=[];
    let requete=`select distinct new map(s as synchronisation,u as controleur) 
    from Synchronisation s
    left join Utilisateur u on s.idControleur=u.numeroUser`;
    let where=" Where";
    let date=form.date?form.date.toLocaleDateString():"";
    if (date != "") where += " and s.date like '%" + date +"%'";
    if (form.idControleur != "") where += " and s.idControleur=" + form.idControleur;
    if (form.quartier!="") where+=" and s.quartiers='"+form.quartier+"'";
    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 6) requete += where;
    requete+=" ORDER BY s.id DESC";
    this.requestPage=new RequestPage(requete);
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
