import { Component, OnInit } from '@angular/core';
import { RequestPage } from '../../models/requestPage';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-list-reclamation',
  templateUrl: './list-reclamation.component.html',
  styleUrls: ['./list-reclamation.component.css']
})
export class ListReclamationComponent implements OnInit {
  loading=false;
  reclamations=[];
  taxes;
  souscriptions=[];
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }
  
  constructor(private httpService:HttpService,private dataService: DataService) {}

  ngOnInit() {
    this.httpService.post("requestSql", Requetes.taxes)
                          .subscribe(data=>this.taxes=data);
    let requete=this.dataService.requete_list_reclamations;
    if(requete) {
      this.loadPage(requete);
    }
    
  }
   //Libérer les souscriptions
   ngOnDestroy() {
    this.souscriptions.forEach(s=>s.unsubscribe());
  }

  loadPage(requete){
    this.loading=true;
    this.souscriptions.push(this.httpService.post("requestSql", requete)
    .subscribe(data => {
      this.reclamations=data;
      this.loading=false;
      console.log(data)
    }));
  }

  rechercher(form){
    let date=form.date?form.date.toLocaleDateString():"";
    console.log(form,date)
    this.reclamations=[];   
    let reqSql=`select distinct new map(rc as reclamation,r as redevable,f as facture) 
                from Reclamation rc
                join Facture f on f.numeroFacture=rc.idFacture	
                join RedevableShort r on r.numRedevable=rc.idRedevable	`;
    let where=" Where";
    if (date != "") where += " and rc.dateReclamation='" + date+"'";
    if (form.taxe != "") where += " and rc.typeTaxe='" + form.taxe+"'";
    if (form.numFacture != "") where += " and rc.idFacture=" + form.numFacture; 
    if (form.numRedevable != "") where += " and rc.idRedevable="+form.numRedevable;
    if (form.nomRedevable != "") where += " and concat(r.nomRedevable,' ',r.prenom) like '%" + form.nomRedevable + "%'";
    if (form.controle != "") where += " and rc.controleEffectue= '"+form.controle+"'";
    if (form.etat != "") where += " and rc.etat= '"+form.etat+"'";
    if (form.numTitre != "") where += " and f.numeroTitre= '"+form.numTitre+"'";
    if (form.annee != "") where += " and f.anneeTitre like '%"+form.annee+"%'";
    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 6) reqSql += where;
    reqSql+=" ORDER BY rc.etat ASC , rc.id DESC ";
    this.dataService.requete_list_reclamations=reqSql;
    this.loadPage(reqSql);    
  }
  
  getEtat(etat){
    return etat=="ENCOURS"?
    "<img src='assets/images/vert.jpg' height='15px'>"
    :
    "<img src='assets/images/rouge.jpg' height='15px'>"
    ;
  }
}
