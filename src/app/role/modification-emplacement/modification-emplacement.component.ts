import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Redevable } from '../../models/redevable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../shared/custom.validators';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-modification-emplacement',
  templateUrl: './modification-emplacement.component.html',
  styleUrls: ['./modification-emplacement.component.css']
})
export class ModificationEmplacementComponent implements OnInit {
  redevablesAutorise=[];rues=[];civilites=[];professions=[];
  secteurs = [];complnumrue=[];etats=[];
  emplacement:{[key:string]:any}={};
  redevable;taxe;
  nbarticle=0;
  yaFacture=false;
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }
  constructor(private httpService:HttpService,
              private fb:FormBuilder,
              private router:Router,
              private location:Location,
              private route:ActivatedRoute) {}

  ngOnInit() {
    //Définir les propriétés de l'objet à envoyer au serveur 
    //champs du formulaire et autres
    this.form=this.fb.group({
      codeType:[''],
      anneeExerciceImputation:[''],
      numRedevable:[''],
      numero:[''],
      codeVoie:[''],
      codePostal:['',Validators.required],
      adresse1:['',Validators.required],
      adresse2:[''],
      adresse3:[''],
      searchVoie:[''],
      resultatRues:[''],
      idRedevableAutorise:[''],
      searchRedevable:[''],
      resultatRedevables:[''],
      codeSecteur:['',Validators.required],
      numeroEmplacementPersonalise:['',Validators.required],
      nomquartier:['',Validators.required],
      observation:[''],
      numrue:['',Validators.required],
      complementNumeroRueEmpl:[''],
      raisonSocial:[''],
      ville:['',Validators.required],
      cedex:[''],
      numTel:[''],
      numPortable:[''],
      numFax:[''],
      email:[''],
      rapprochementIdoss:[false],
      codeInscription:['RCS'],
      numInscription:[''],
      dateInscription:[''],
      infosIdoss:[''],
      enActivite:['enActivite'],
      codeProfession:[53],
      dateDebutActivite:[''],
      dateFinActivite:[''],
      raisonSocialeProprietaire:[''],
      nomProprietaire:[''],
      prenomProprietaire:[''],
      villeProprietaire:[''],
      codePostaleProprietaire:[''],
      numVoieProprietaire:[''],
      complementNumeroRueProprietaire:[''],
      adressProprietaire:[''],
      compl1AdresseProprietaire:[''],
      compl2AdresseProprietaire:[''],
      rdCedex:['']
    });
    this.form.valueChanges.subscribe(()=>{
        CustomValidators.detectErrors(this.form,this.formErrors);
    });

    //Permet de lancer plusieurs observables à la fois en parallèle
    forkJoin( 
      this.httpService.post("requestSql",Requetes.listevaleursByType('type_civilite')),
      this.httpService.post("requestSql",Requetes.listevaleursByType('complNumRue')),
      this.httpService.post("requestSql", Requetes.listevaleursByType('code_secteur')),    
      this.httpService.post("requestSql", Requetes.listevaleursByType('etat_emplacement')),
      this.httpService.post("requestSql",Requetes.professions))
      .subscribe(([r1,r2,r3,r4,r5])=>{
          this.civilites=r1;
          this.complnumrue=r2;
          this.secteurs=r3.sort((a,b)=>{
            if(parseInt(a.valeur,10)<parseInt(b.valeur,10)) return -1
            if(parseInt(a.valeur,10)==parseInt(b.valeur,10)) return 0
            if(parseInt(a.valeur,10)>parseInt(b.valeur,10)) return 1
          });
          this.etats=r4;
          this.professions=r5;    
      });
    //Récupérer les paramètres du l'url
    this.route.paramMap.subscribe(params=>{
      this.emplacement.numero=params.get("numero");
      this.emplacement.codeType=params.get("idTaxe");
      this.emplacement.numRedevable=params.get("numRedevable");
      this.emplacement.codeSecteur=params.get("secteur");
      this.emplacement.anneeExerciceImputation=params.get("annee");
      this.emplacement.numeroEmplacementPersonalise=params.get("numeroPersonalise");
    //Emplacement existant
    if(this.emplacement.numero){
      this.route.data.subscribe(data=>{
        this.emplacement=data.resultat[0].emplacement;
        this.redevable=data.resultat[0].redevable;
        this.taxe=data.resultat[0].taxe;
        this.nbarticle=data.resultat[0].nbarticle;
        this.httpService.post("requestSql",Requetes.nbFacturesEmplacement(this.emplacement.numero))
          .subscribe(data=>{//nb de facture pour cet emplacement
            this.yaFacture=data[0]>0
          })
        this.initialize();
      });
    }
    else{
        forkJoin(
          this.httpService.post("requestSql",Requetes.redevableByNumredevable(this.emplacement.numRedevable)),
          this.httpService.post("requestSql",Requetes.taxeById(this.emplacement.codeType,this.emplacement.anneeExerciceImputation))
        )
        .subscribe(([r1,r2])=>{
          this.redevable=r1[0];
          this.taxe=r2[0];
          //Ajouter les valeurs par défaut
          this.emplacement.idRedevableAutorise=this.redevable.numRedevable;
          this.emplacement.ville=this.redevable.ville;
          this.emplacement.codePostal=this.redevable.codePostal;
          this.initialize();
        });    
      }
     
    });
  }

  initialize(){
    this.form.patchValue(this.emplacement);
  }

  onSearchRueBy(key:string){
    let reqSql:string;
    let nomvoie:string;
    this.form.value.resultatRues="";
    switch(key){
      case "code":  this.httpService.post("requestSql", Requetes.ruesByCode(this.form.value.codeVoie))
                    .subscribe(data => this.rues=data);
                    break;
      case "nom":   nomvoie=this.form.value.searchVoie.replace("'","\'");
                    this.httpService.post("requestSql", Requetes.ruesByNom(nomvoie))
                    .subscribe(data => this.rues=data);
    }
  }

  onselectRue(rue){
    console.log("rue selectionne",JSON.stringify(rue))
    this.form.patchValue({
      codeVoie:rue.codeVoie,
      codePostal:rue.codePostal,
      adresse1:rue.prefixe+" "+rue.liaison+" "+rue.nomrue
    })
  }

  onSearchRedevable(){
    this.httpService.post("requestSql", Requetes.redevablesByNom(this.form.value.searchRedevable))
                    .subscribe(data => this.redevablesAutorise=data);
  }

  onselectRedevable(redevable){
    this.form.patchValue({idRedevableAutorise:redevable.numRedevable});
  }
  /**
   * Traitement des dates:
   * string : date en provenance du serveur reste inchangé
   * object : date modifiée depuis formulaire => doit transformer en string avant de soumettre
   */
  onValider(){
    let {dateInscription,dateDebutActivite,dateFinActivite}=this.form.value;
    if(typeof dateInscription==='object'){
      this.form.value.dateInscription=dateInscription?dateInscription.toLocaleDateString():''
    }
    if(typeof dateDebutActivite==='object'){
      this.form.value.dateDebutActivite=dateDebutActivite?dateDebutActivite.toLocaleDateString():''
    }
    if(typeof dateFinActivite==='object'){
      this.form.value.dateFinActivite=dateFinActivite?dateFinActivite.toLocaleDateString():''
    }
    
    this.httpService.post("saveEmplacement",this.form.value)
    .subscribe(data => {
      console.log("retour valider",data);
      this.router.navigate(['.',{numero:data.numero}],{ relativeTo: this.route })
    });
  }

  onSupprimer(){
    if(this.yaFacture){
      alert("Impossible de supprimer cet emplacment\nil y a une facture valide relatif à cet emplacement !! ")
      return;
    }

    if(confirm("Vous voulez vraiment supprimer cet emplacement ?")){
      this.httpService.post("deleteEmplacement",this.form.value.numero)
      .subscribe(data => {
        this.location.back();
      });
    }
  }

}
