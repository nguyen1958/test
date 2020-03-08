import { Component, OnInit, OnDestroy  } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Requetes } from '../../models/Requetes';

@Component({
  selector: 'app-recherche-facture',
  templateUrl: './recherche-facture.component.html',
  styleUrls: ['./recherche-facture.component.css']
})
export class RechercheFactureComponent implements OnInit,OnDestroy {
  
  taxes = [];factures=[];souscriptions= [];
  loading=false;message = "";
  requete;
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }
  constructor(private httpService: HttpService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
  //Permet de lancer plusieurs observables à la fois en parallèle
    this.souscriptions.push(
        this.httpService.post("requestSql", Requetes.taxes)
      .subscribe((data) => { this.taxes = data})
    );
    //Charger la liste avec les critères précédents
    if(this.dataService.requete_factures){
      this.requete=this.dataService.requete_factures;
      this.loadPage();
    }
  }

  loadPage(){
    this.loading=true;
    this.souscriptions.push(this.httpService.post("requestSql",this.requete)
    .subscribe(data =>{
      this.factures=data
      this.loading=false;
    }));
  }

  rechercher(form) {
    this.message="";
    this.factures=[];
    let {dateFacture}=form;
    if(typeof dateFacture==='object'){
      form.dateFacture=dateFacture?dateFacture.toLocaleDateString():''
    }
    //Requete obtenant le nbre d'enregistrement trouvé
    let reqSql = "select count(distinct f) from Facture f " +
      "join BatchTraitement bt on bt.id=f.idBatchTraitement " +
      "join RedevableShort r on r.numRedevable=f.idClient ";
    let where = "where bt.valide='true' and bt.etape='facturation'";
    let orderBy = " Order by f.typeTaxe ,f.anneeEx DESC";
    if (form.noFacture != "") where += " and f.idFacture=" + Number(form.noFacture);
    if (form.typeTaxe != "") where += " and f.typeTaxe='" + form.typeTaxe + "'";
    if (form.noRedevable != "") where += " and f.idClient="+form.noRedevable;
    if (form.nomRedevable != "") where += " and concat(r.nomRedevable,' ',r.prenom) like '%"+ form.nomRedevable+"%'";
    if (form.montantFacture != "") where += " and f.montantTotal=" + form.montantFacture;
    if (form.etatFacture != "") {
      switch(form.etatFacture){
        case "PAYEE":where += " and f.solde=0";break;
        case "IMPAYE":where += " and f.solde<>0 and f.etat='VALIDE'";break;
        default:where += " and f.etat='"+form.etatFacture+"'";break;
      }
    }
    if (form.dateFacture != "") where += " and f.dateCreation='" + form.dateFacture + "'";
    if (form.annee != "") where += " and f.anneeEx='" + form.annee + "'";
    reqSql += where;
    this.souscriptions.push(this.httpService.post("requestSql", reqSql)
      .subscribe(data => {
        if (data[0] == 0) {
          this.message = "Aucune donnée sélectionnée pour ces critères ...";
        }
        else if (data[0] > 1000) {
          this.message = "Il y a plus de 1000 resultats veuillez remplir un ou plusieurs champs de filtre de recherche pour obtenir les informations détaillées.";
        }
        else {//Changer nombre trouvé par les données à sélectionner
          this.loading=true;
          reqSql = reqSql.replace("count(distinct f)", "distinct new map(f as facture,r as redevable)");
          reqSql += orderBy;
          this.souscriptions.push(this.httpService.post("requestSql", reqSql)
            .subscribe(data => {
              this.factures=data;
              //Sauvegarder la requete et naviguer à la liste des redevables
              this.dataService.requete_factures=reqSql;
              this.loading=false;
              console.log(data)
            }));
        };
      }));
  }
  //Libérer les souscriptions
  ngOnDestroy() {
    console.log(this.souscriptions.length);
    this.souscriptions.forEach(s=>s.unsubscribe());
  }

  getFullYear(){
    return new Date().getFullYear();
  }

}
