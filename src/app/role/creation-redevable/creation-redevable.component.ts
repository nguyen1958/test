import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { Redevable } from '../../models/redevable';

@Component({
  selector: 'app-creation-redevable',
  templateUrl: './creation-redevable.component.html',
  styleUrls: ['./creation-redevable.component.css']
})
export class CreationRedevableComponent implements OnInit {
  title:string;
  naturejuridiques=[];civilites=[];professions=[];complnumrue=[];
  rues=[];emplacements=[];factures=[];remboursements=[];payements=[];
  banques=[];typePayements=[];
  redevable:Redevable;
  bufferFacture={
    anneeExercice:new Date().getFullYear(),
    etat:'enCours'
  };
  bufferPayement={
    idTypePayement:"",
    typePayement:"",
    datePayement:new Date().toLocaleDateString(),
    nombreDeFacturePayee:0,
    montantTotal:0,
    montantPayement:0,
    payements:[]
  }
  numRedevable;
  factureEncours=false;
  etat="tous";
  etatPaiement="enCours";
  
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }

  constructor(private route:ActivatedRoute,
              private router:Router,
              private httpService:HttpService){};

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
      this.initialize(params);
    });
    
    //Permet de lancer plusieurs observables à la fois en parallèle
    forkJoin( this.httpService.post("requestSql",Requetes.naturejuridiques),
              this.httpService.post("requestSql",Requetes.listevaleursByType('type_civilite')),
              this.httpService.post("requestSql",Requetes.listevaleursByType('complNumRue')),
              this.httpService.post("requestSql",Requetes.banques),
              this.httpService.post("requestSql",Requetes.typePayements),
              this.httpService.post("requestSql",Requetes.professions))
              .subscribe(([r1,r2,r3,r4,r5,r6])=>{
                  this.naturejuridiques=r1;
                  this.civilites=r2; 
                  this.complnumrue=r3;
                  this.banques=r4; 
                  this.typePayements=r5;
                  this.professions=r6;           
    });
  }
  
  initialize(params){
    this.redevable=new Redevable();
    console.log("new Redevable",this.redevable);
    this.numRedevable=params.get("numRedevable");
    this.title=`CREATION D'UN NOUVEAU REDEVABLE`;
    console.log("parametre redevable =>"+this.numRedevable);
    //Cas modification : arrive depuis un lien redevable
    if(this.numRedevable){
      this.title=`MODIFICATION DU REDEVABLE N° ${this.numRedevable}`
      //Charger données du redevable
      this.httpService.post("requestSql",Requetes.redevableByNumredevable(this.numRedevable))
      .subscribe(data=>{
        //this.redevable={...data[0]};
        //Merge 2 objets
        this.redevable=Object.assign({},this.redevable,data[0].redevable,data[0].rue)
      });
     this.chargerEmplacements();
     this.chargerFactures();
     this.chargerRemboursements();
     this.getFactureEmplacementEncours(this.numRedevable)
    }
  }

  getUrlFacture(facture){
    return `${this.httpService.apiUrl}/showFile?type=facture&path=${facture.anneeEx}-${facture.idBatchTraitement}/${facture.numeroFacture}.pdf`
  }

  //Requete selon etat emplacement sélectionné (tous,enActivite,Termine)            
  getRequeteEmplacement(){
    let clauseEtat=this.etat=="tous"?"":" and e.enActivite='"+this.etat+"'";
    return "select distinct new map(e as emplacement, count(distinct a.idArticle) as article,i as taxe,count(distinct ie.idImage) as image, count(distinct al.idArticle) as alerte) from Emplacement e "+
    "left join ImputationShort i on i.id.idImputation=e.codeType and e.anneeExerciceImputation=i.id.anneeExercice "+
    "left join ElementFacturation el on el.numeroEmplacement=e.numero "+
    "left join Article a on a.idElementFacturation=el.numero and a.etat!='NePlusFacturer' "+
    "left join Image_Emplacement ie on ie.idEmplacement=e.numero "+
    "left join Alerte al on al.idArticle=a.idArticle and al.etatAlerte='ENCOURS' "+
    "where e.source='normal' and e.numRedevable="+this.numRedevable+clauseEtat+" group by e.numero";
  }

  getContent(key,value){
    switch(key){
      case "etat"  :return value=="termine"?"<img src='assets/images/gris.jpg' height='15px'>":"<img src='assets/images/vert.jpg' height='15px'>";
      case "image" :return value==0?"-":"<img title='Il y a des images dans cet emplacement !' src='assets/images/valider.png' height='20px'>";
      case "alerte" :return value==0?"-":"<img title='Il y a des alertes en cours sur des ouvrages dans cet emplacement !' src='assets/images/alerte.png' height='15px'>";                
    }
  }

  getFactureEmplacementEncours(numRedevable){
    //data est un tableau car résultat fourni par le serveur est une collection
    this.httpService.post("requestSql",Requetes.factureEmplacementEnCours(numRedevable)).subscribe(data =>{
      this.factureEncours=(data[0].emplacementCount>0 || data[0].facturaCount>0)
    });
  }

  chargerEmplacements(){
    //Charger des emplacements du redevable
    this.httpService.post("requestSql",this.getRequeteEmplacement())
    .subscribe(data=>{
      this.emplacements=data;  
    });
  }
  
  chargerFactures(){
     //Charger des factures du redevable
     this.httpService.post("requestSql",Requetes.facturesRedevable(this.numRedevable,this.bufferFacture.anneeExercice))
     .subscribe(data=>{
       this.factures=data;
     });  
  }

  chargerRemboursements(){
    //Charger des remboursements du redevable
    this.httpService.post("requestSql",Requetes.remboursementsRedevable(this.numRedevable,this.bufferFacture.anneeExercice))
    .subscribe(data=>{
      this.remboursements=data;  
    });  
 }
    
  onSearchBy(key:string){
    console.log("onSearchBy",this.redevable);
    let reqSql:string;
    let nomvoie:string;
    this.redevable.resultat="";
    switch(key){
      case "code":  this.httpService.post("requestSql", Requetes.ruesByCode(this.redevable.codeRivolie))
                    .subscribe(data => this.rues=data);
                    break;
      case "nom":   nomvoie=this.redevable.searchVoie.replace("'","''");
                    this.httpService.post("requestSql", Requetes.ruesByNom(nomvoie))
                    .subscribe(data => this.rues=data);
                    break;
    }
  }

  onselectRue(rue){
    this.redevable.codeVoie=rue.codeVoie;
    this.redevable.codeRivolie=rue.codeRivolie;
    this.redevable.codePostal=rue.codePostal;
    this.redevable.adresse1=rue.prefixe+" "+rue.liaison+" "+rue.nomrue;
  }

  onselectTypePayement(data){
    console.log("onselectTypePayement",data)
    this.bufferPayement.idTypePayement=data.id;
  }

  onChangeEtat(){
    this.chargerEmplacements();
  }

  onChangeEtatFacture(){
    this.chargerFactures();
    this.bufferPayement={
      idTypePayement:"",
      typePayement:"",
      datePayement:new Date().toLocaleDateString(),
      nombreDeFacturePayee:0,
      montantTotal:0,
      montantPayement:0,
      payements:[]
    }

  }

  onCheckPaiement(checked,facture){
    console.log(JSON.stringify(this.bufferPayement));
    let montant=parseFloat(facture.solde);
    if(checked) {
      this.bufferPayement.montantTotal=+(this.bufferPayement.montantTotal+montant).toFixed(2);
      this.bufferPayement.nombreDeFacturePayee++;
      this.bufferPayement.payements.push(facture.numeroFacture);
    }
    else {
      this.bufferPayement.montantTotal=+(this.bufferPayement.montantTotal-montant).toFixed(2);
      this.bufferPayement.nombreDeFacturePayee--;
      this.bufferPayement.payements=this.bufferPayement.payements.filter((numero)=>{return numero!=facture.numeroFacture});
    } 
    this.bufferPayement.montantPayement=this.bufferPayement.montantTotal;
    console.log(JSON.stringify(this.bufferPayement));
  }

  onDateNaissanceChange(event:Date){
    this.redevable.dateNaissance=event?event.toLocaleDateString():"";
    console.log("ondate...",event,this.redevable.dateNaissance)
  }

  onDatePayementChange(event){
    this.bufferPayement.datePayement=event?event.toLocaleDateString():new Date().toLocaleDateString();
    console.log("ondate...",event,this.bufferPayement.datePayement)
  }

  saveRedevable():void{
    console.log("saveRedevable :",JSON.stringify(this.redevable));
    this.httpService.post("saveRedevable",this.redevable)
    .subscribe(data => {
      this.rues=[];
      //Re-router en cas de création vers modification avec nouveau ID
      this.router.navigate(['.',{numRedevable:data.numRedevable}],{ relativeTo: this.route })
    });
  }

  deleteRedevable(){
    console.log("deleteRedevable :",JSON.stringify(this.redevable));
    if(this.factureEncours){
      window.alert(`Suppression impossible :\n\nIl existe des factures encours...`);
      return;
    }
    if(confirm(`Confirmation\n\nVous êtes sur le point de supprimer ce redevable`)){
      this.httpService.post("deleteRedevable",this.redevable.numRedevable)
      .subscribe(data => {
        this.router.navigate(['../Liste des redevables'],{ relativeTo: this.route })
      });
    }
      
  }
  
  savePayement():void{
    console.log("savePayement :",JSON.stringify(this.bufferPayement));
    let listfactures="";let message="";
    for(let numero of this.bufferPayement.payements){
      listfactures=`-facture n° ${numero}\n`;
    }
    switch (this.bufferPayement.typePayement){
      case "Remise": message=`Voulez vous continuer la remise de ${this.bufferPayement.montantPayement} euros
      -Nombre total de factures : ${this.bufferPayement.nombreDeFacturePayee}
      ${listfactures}`;break
      default: message=`Voulez-vous continuer ce paiement?
      -Montant total paiement : ${this.bufferPayement.montantPayement} euros
      -Nombre total de factures : ${this.bufferPayement.nombreDeFacturePayee}
      -Factures payées : 
      ${listfactures}`;break
    }
    if(confirm(message)){
      this.httpService.post("savePayement",this.bufferPayement)
      .subscribe(data => {
        this.router.navigate(['../Info paiement',{id:data.id}],{ relativeTo: this.route })
        console.log("retour valder",data)
      });
    }
  }

}
