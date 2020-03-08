import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Requetes } from '../../models/Requetes';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-recherche-paiement',
  templateUrl: './recherche-paiement.component.html',
  styleUrls: ['./recherche-paiement.component.css']
})
export class RecherchePaiementComponent implements OnInit,OnDestroy{
  taxes = [];banques=[];typePayements=[];payements=[];souscriptions= [];
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
      forkJoin( this.httpService.post("requestSql", Requetes.taxes),
                this.httpService.post("requestSql", Requetes.banques),
                this.httpService.post("requestSql", Requetes.typePayements))
      .subscribe(([r1, r2, r3]) => {
        this.taxes = r1;
        this.banques = r2;
        this.typePayements = r3;
      })
    );
    //Charger la liste avec les critères précédents
    if(this.dataService.requete_paiements){
      this.requete=this.dataService.requete_paiements;
      this.loadPage();
    }
  }

  loadPage(){
    this.loading=true;
    this.souscriptions.push(this.httpService.post("requestSql",this.requete)
    .subscribe(data =>{
      this.payements=data
      this.loading=false;
    }));
  }

  rechercher(form) {
    this.message="";
    let {datePayement}=form;
    if(typeof datePayement==='object'){
      form.datePayement=datePayement?datePayement.toLocaleDateString():''
    }
    //Requete obtenant le nbre d'enregistrement trouvé
    let reqSql = "select count(distinct p) from Payement p " +
      "join TypePayement tp on tp.id=p.idTypePayement " +
      "join LignePayement lp on lp.idPayement=p.id " +
      "join Facture f on f.idFacture=lp.idFacture ";
    let where = "where ";
    let orderBy = " Order by p.id desc";
    if (form.noFacture != "") where += " and f.idFacture=" + Number(form.noFacture);
    if (form.typeTaxe != "") where += " and f.typeTaxe='" + form.typeTaxe + "'";
    if (form.montantPayement != "") where += " and p.montantPayement="+form.montantPayement;
    if (form.typePayement != "") where += " and p.idTypePayement="+ form.typePayement;
    if (form.etatPayement != "") where += " and p.etat='" + form.etatPayement+"'";
    if (form.banque != "") where += " and p.idBanque=" + form.banque;
    if (form.numQuittance != "") where += " and p.numeroQuittance='" + form.numQuittance + "'";
    if (form.numCheque != "") where += " and p.numeroCheque='" + form.numCheque + "'";
    if (form.nbFacture != "") where += " and p.nombreDeFacturePayee=" + form.nbFacture;
    if (form.datePayement != "") where += " and p.datePayement='" + form.datePayement + "'";
    if (form.annee != "") where += " and p.datePayement like '%%/%%/" + form.annee + "'";
    //supprimer le premier and
    where = where.replace("and", "");
    //On ajoute clause where si y a condition
    if (where.length > 6) reqSql += where;
    this.souscriptions.push(this.httpService.post("requestSql", reqSql)
      .subscribe(data => {
        if (data[0] == 0) {
          this.message = "Aucune donnée sélectionnée pour ces critères ...";
        }
        else if (data[0] > 300) {
          this.message = "Il y a plus de 300 resultats veuillez remplir un ou plusieurs champs de filtre de recherche pour obtenir les informations détaillées.";
        }
        else {//Changer nombre trouvé par les données à sélectionner
          this.loading=true;
          reqSql = reqSql.replace("count(distinct p)", "distinct new map(p as payement,f as facture,tp as typePayement)");
          reqSql += orderBy;
          this.souscriptions.push(this.httpService.post("requestSql", reqSql)
            .subscribe(data => {
              this.payements=data;
              //Sauvegarder la requete et naviguer à la liste des redevables
              this.dataService.requete_paiements=reqSql;
              this.loading=false;
              //console.log(data)
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
