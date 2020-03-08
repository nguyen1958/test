import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../shared/custom.validators';


@Component({
  selector: 'app-list-ouvrage',
  templateUrl: './list-ouvrage.component.html',
  styleUrls: ['./list-ouvrage.component.css']
})
export class ListOuvrageComponent implements OnInit {
  emplacement;numero;redevable;taxe;
  anExercice=new Date().getFullYear();
  articles=[];baremes=[];
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  uniteTravail="";
  /*
  buffer={
    dateDebutAutorisation:new Date(),
    dateFinAutorisation:new Date().toLocaleDateString(),
    codeBareme:"",
    nom:"",
    quantite:"",
    commentaire:"",
    choix:"lineaire",
    typeOuvrage:"Normal"
  };
  */
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }

  constructor(private httpService:HttpService,
              private fb:FormBuilder,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
      this.numero=params.get("numero");
    });
    this.route.data.subscribe(data=>{
      this.emplacement={...data.resultat[0].emplacement};
      this.redevable={...data.resultat[0].redevable};
      this.taxe={...data.resultat[0].taxe};
      this.httpService.post("requestSql",Requetes.articlesEmplacement(this.numero))
        .subscribe(data=>this.articles=data);
      this.httpService.post("requestSql",Requetes.baremesByTaxe(this.taxe.id.idImputation))
        .subscribe(data=>this.baremes=data);   
    });
    this.form=this.fb.group({
      anExercice:[new Date().getFullYear()],
      codeBareme:['',Validators.required],
      dateDebutAutorisation:['',Validators.required],
      dateFinAutorisation:[''],
      nom:[''],
      choix:['lineaire'],
      longueur:['1.00',[CustomValidators.decimal,Validators.required]],
      largeur:['1.00',[CustomValidators.decimal,Validators.required]],
      surface:['0.00',[CustomValidators.decimal,Validators.required]],
      typeOuvrage:['Normal'],
      source:['normal'],
      nombreFaceAffiche:['1',[CustomValidators.entier,Validators.required]],
      quantite_article:['1.00',[CustomValidators.decimal,Validators.required]],
      commentaire:[''],
      etat:['AFacturer'],
      dernierePeriodeFacture:['0'],
      numeroEmplacement:[this.numero]
    });

    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors)
    });    
  }

  onChangeBareme(){
    let code=this.form.get('codeBareme').value;
    let bareme=this.baremes.find(o=>o.id.code==code);
    this.uniteTravail=bareme.uniteDeTravail;
    console.log(this.form.get('codeBareme').value,JSON.stringify(bareme));
    console.log("FORFAIT",bareme.uniteDeTravail.includes("FORFAIT"));
    console.log("UNITE",bareme.uniteDeTravail.includes("UNITE"));
    console.log("ML",bareme.uniteDeTravail.includes("ML"));
    console.log("M2",bareme.uniteDeTravail.includes("M2"));
  }

  getContent(key,value){
    //console.log("key/value=",key,value);
    let suffixe="";
    //let total=0.00;
    let surface=(value.article.surface!=0?value.article.surface:value.article.longueur*value.article.largeur);
    let qteTotal=surface * value.article.quantite_article;
    switch(key){
      case "etat"  :
          switch(value.article.etat){
            case "ControlerAlerte": return "<img src='assets/images/rouge.jpg' height='15px'> Alerte";
            case "ControlerPresent": return "<img src='assets/images/vert.jpg' height='15px'> CPresent";
            case "ControlerAbsent": return "<img src='assets/images/gris.jpg' height='15px'> CAbsent";
            case "Facturer": return "<img src='assets/images/vert.jpg' height='15px'> Facturé";
            case "AFacturer": return "<img src='assets/images/bleu.jpg' height='15px'> AFacturer";
            case "FacturerAControler": return "<img src='assets/images/jaune.jpg' height='15px'> FAControler";
            case "ControlerAFacturer": return "<img src='assets/images/bleu.jpg' height='15px'> CAFacturer";
            case "NePlusFacturer": return "<img src='assets/images/gris.jpg' height='15px'> NPlus";
            case "NePasFacturer": return "<img src='assets/images/gris.jpg' height='15px'> NPasF";
            case "Rembourser": return "<img src='assets/images/gris.jpg' height='15px'> Remboursé";
          }
      case "detail" :
            switch (value.bareme.uniteDeTravail) {
              case "UNITE":return `${qteTotal.toFixed(2)}`
              case "M2": return `${surface.toFixed(1)} ${value.bareme.uniteDeTravail} * ${value.article.quantite_article}`
              case "ML":return `${value.article.longueur.toFixed(1)} ${value.bareme.uniteDeTravail} * ${value.article.quantite_article}`
              case "FORFAIT": return `${qteTotal.toFixed(2)}`
            }
      case "puBareme":return `${value.bareme.prixUnit.toFixed(2)}`  
      case "periode":return `${this.calculPeriode(value).toFixed(0)}`
      case "qtebareme":return `${qteTotal.toFixed(2)}`
      case "total":return `${(qteTotal * value.bareme.prixUnit).toFixed(2)}`
      case "typeOuvrage": return `${value.article.typeOuvrage}`
      case "faceAffiche": return `${value.article.nombreFaceAffiche}`
      case "dateDebut": return `${value.article.dateDebutAutorisation==''?'-':value.article.dateDebutAutorisation}`
      case "dateFin": return `${value.article.dateFinAutorisation==''?'-':value.article.dateFinAutorisation}`
    }
  }
  
  calculPeriode(data){
    let type=data.bareme.dureeUnitaire;
    let dateSplit=data.article.dateDebutAutorisation.split("/");
    let dateDebut= new Date(dateSplit[2],dateSplit[1]-1,dateSplit[0],1);
    let dateFin=new Date();
    let timeDiff = Math.abs(dateFin.getTime() - dateDebut.getTime());
    switch(type.toLowerCase()){
      case "jour": return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      case "semaine":return Math.ceil(timeDiff / (1000 * 3600 * 24 * 7));
      case "mois": return (dateFin.getFullYear()-dateDebut.getFullYear()) * 12 + (dateFin.getMonth() - dateDebut.getMonth());
      case "trimestre":
            let months=(dateFin.getFullYear()-dateDebut.getFullYear()) * 12 + (dateFin.getMonth() - dateDebut.getMonth());
            return months%3==0?months/3:(months/3)+1;
      case "an": return dateFin.getFullYear()-dateDebut.getFullYear()+1;
      default: return 1;
    }
  }

  totalLigne(){
    let total = 0;
    this.articles.forEach((d) => {
      total += d.article.surface!=0?
               d.article.surface*d.bareme.prixUnit:
               d.article.longueur*d.article.largeur*d.bareme.prixUnit;
    });
    return total;
  }

  saveArticle(form){
    let {dateDebutAutorisation,dateFinAutorisation}=this.form.value;
    if(typeof dateDebutAutorisation==='object'){
      this.form.value.dateDebutAutorisation=dateDebutAutorisation?dateDebutAutorisation.toLocaleDateString():''
    }
    if(typeof dateFinAutorisation==='object'){
      this.form.value.dateFinAutorisation=dateFinAutorisation?dateFinAutorisation.toLocaleDateString():''
    }
    if(this.form.value.nom.length==0){
      this.form.value.nom="#vide"
    }
    console.log(this.form.value);
    this.httpService.post("saveArticle",this.form.value)
    .subscribe(data => {
      console.log("retour valider",data);
      //Recharger la page
      this.ngOnInit()
    });
  }
}
