import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Requetes } from '../../models/Requetes';
import { CustomValidators } from '../../shared/custom.validators';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-modification-ouvrage',
  templateUrl: './modification-ouvrage.component.html',
  styleUrls: ['./modification-ouvrage.component.css']
})
export class ModificationOuvrageComponent implements OnInit {
  idArticle; baremes;etats;historiquesEtat;
  article; emplacement;bareme;
  redevable; taxe; nbarticle;
  uniteTravail;dejaFacturer;
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }

  form: FormGroup;
  formErrors:{[key:string]:any}={};

  constructor(private httpService: HttpService,
              private router:Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idArticle = params.get("id");
    });
    this.route.data.subscribe(data => {
      this.emplacement = data.resultat[0].emplacement;
      this.redevable = data.resultat[0].redevable;
      this.taxe = data.resultat[0].taxe;
      this.bareme = data.resultat[0].bareme;
      this.article = data.resultat[0].article;
      forkJoin(this.httpService.post("requestSql", Requetes.baremesByTaxe(this.taxe.id.idImputation)),
               this.httpService.post("requestSql", Requetes.historiqueEtatOuvrage(this.article.idArticle)),
               this.httpService.post("requestSql", Requetes.listevaleursByType('etat_ouvrage')),
               this.httpService.post("requestSql", Requetes.nbFacturesArticle(this.article.idArticle)),
      ).subscribe(data=>{
        this.baremes = data[0]
        this.historiquesEtat=data[1]
        this.etats = data[2]
        this.dejaFacturer=data[3][0]>0 
        if(this.dejaFacturer){
          this.form.get('codeBareme').disable()
          this.form.get('dateDebutAutorisation').disable()
          this.form.get('typeOuvrage').disable()
          this.form.get('nombreFaceAffiche').disable()
          this.form.get('choix').disable()
          this.form.get('longueur').disable()
          this.form.get('largeur').disable()
          this.form.get('surface').disable()
          this.form.get('quantite_article').disable()
        }
      });
      this.uniteTravail=this.bareme.uniteDeTravail;
    });
    //Instancier et initialiser le formulaire
    this.form = new FormGroup({
      idArticle:new FormControl(this.article.idArticle),
      anExercice:new FormControl(this.article.anExercice),
      idElementFacturation:new FormControl(this.article.idElementFacturation),
      source:new FormControl(this.article.source),
      numeroTmp:new FormControl(this.article.numeroTmp),
      idTransaction:new FormControl(this.article.idTransaction),
      rembourse:new FormControl(this.article.rembourse),
      codeBareme: new FormControl({value:this.article.codeBareme,disabled:this.dejaFacturer}, Validators.required),
      dateDebutAutorisation: new FormControl(this.article.dateDebutAutorisation, Validators.required),
      dateFinAutorisation: new FormControl(this.article.dateFinAutorisation),
      nom: new FormControl(this.article.nom=="#vide"?"":this.article.nom),
      choix: new FormControl(this.article.surface != 0 ? 'surface' : 'lineaire'),
      longueur: new FormControl(this.article.longueur,[CustomValidators.decimal,Validators.required]),
      largeur: new FormControl(this.article.largeur,[CustomValidators.decimal,Validators.required]),
      surface: new FormControl(this.article.surface,[CustomValidators.decimal,Validators.required]),
      typeOuvrage: new FormControl(this.article.typeOuvrage,Validators.required),
      nombreFaceAffiche: new FormControl(this.article.nombreFaceAffiche,[CustomValidators.entier,Validators.required]),
      quantite_article: new FormControl(this.article.quantite_article, [Validators.required,CustomValidators.entier]),
      commentaire: new FormControl(this.article.commentaire),
      etat: new FormControl(this.article.etat),
      dateDernierControl: new FormControl(this.article.dateDernierControl,Validators.required), 
      dateProchainControl: new FormControl(this.article.dateProchainControl), 
      dateFinAutorisationIdoss: new FormControl(this.article.dateFinAutorisationIdoss), 
      dernierePeriodeFacture: new FormControl(this.article.dernierePeriodeFacture, CustomValidators.entier)
    });
    //Activer ou desactiver les validators
    /*
    if(this.taxe.libelle=='TLPE'){
      this.form.get('typeOuvrage').setValidators(Validators.required);
      this.form.get('nombreFaceAffiche').setValidators([Validators.required,CustomValidators.entier]);
    }
    else{      
      this.form.get('longueur').setValidators([Validators.required,CustomValidators.decimal]);
      this.form.get('largeur').setValidators([Validators.required,CustomValidators.decimal]);
      this.form.get('surface').setValidators([Validators.required,CustomValidators.decimal]);
    }
    */
    //if any field is changed, vérifier erreur du formulaire 
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors)
    });

    CustomValidators.detectErrors(this.form,this.formErrors)
  }

  onChangeBareme(){
    let code=this.form.get('codeBareme').value;
    let bareme=this.baremes.find(o=>o.id.code==code);
    this.uniteTravail=bareme.uniteDeTravail;
  }

  /**
   * Changement choix de dimension
   * Activer/désactiver les validators des champs selon le choix
   */
  onChoixChange(value:string):void{
    const longueurControl=this.form.get('longueur');
    const largeurControl=this.form.get('largeur');
    const surfaceControl=this.form.get('surface');
    if(value=='surface'){
      longueurControl.clearValidators();longueurControl.updateValueAndValidity();
      largeurControl.clearValidators();largeurControl.updateValueAndValidity();
      surfaceControl.setValidators([Validators.required,CustomValidators.decimal]);surfaceControl.updateValueAndValidity();
    }
    else{
      longueurControl.setValidators([Validators.required,CustomValidators.decimal]);longueurControl.updateValueAndValidity();
      largeurControl.setValidators([Validators.required,CustomValidators.decimal]);largeurControl.updateValueAndValidity();
      surfaceControl.clearValidators();surfaceControl.updateValueAndValidity();
    }
  }
  /**
   * Traitement des dates:
   * string : date en provenance du serveur reste inchangé
   * object : date modifiée depuis formulaire => doit transformer en string avant de soumettre
   */
  saveArticle(): void {
    let {dateDebutAutorisation,dateFinAutorisation,dateDernierControl,
         dateProchainControl,dateFinAutorisationIdoss,dernierePeriodeFacture}=this.form.value;
    if(typeof dateDebutAutorisation==='object'){
      this.form.value.dateDebutAutorisation=dateDebutAutorisation?dateDebutAutorisation.toLocaleDateString():''
    }
    if(typeof dateFinAutorisation==='object'){
      this.form.value.dateFinAutorisation=dateFinAutorisation?dateFinAutorisation.toLocaleDateString():''
    }
    if(typeof dateDernierControl==='object'){
      this.form.value.dateDernierControl=dateDernierControl?dateDernierControl.toLocaleDateString():''
    }
    if(typeof dateProchainControl==='object'){
      this.form.value.dateProchainControl=dateProchainControl?dateProchainControl.toLocaleDateString():''
    }
    if(typeof dateFinAutorisationIdoss==='object'){
      this.form.value.dateFinAutorisationIdoss=dateFinAutorisationIdoss?dateFinAutorisationIdoss.toLocaleDateString():''
    }
    if(typeof dernierePeriodeFacture==='object'){
      this.form.value.dernierePeriodeFacture=dernierePeriodeFacture?dernierePeriodeFacture.toLocaleDateString():''
    }
    if(this.form.value.nom.length==0){
      this.form.value.nom="#vide"
    }
    this.httpService.post("saveArticle",this.form.value)
    .subscribe(data => {
      console.log("retour valider",data);
      //retourner à liste des ouvrages
      this.router.navigate(['../Liste des ouvrages',{numero:this.emplacement.numero}],{ relativeTo: this.route })
    });
  }

  deleteArticle(){
    if(confirm("Vous voulez vraiment supprimer cet ouvrage ?")){
      this.httpService.post("deleteArticle",this.form.value)
      .subscribe(data => {
        //retourner à liste des ouvrages
        this.router.navigate(['../Liste des ouvrages',{numero:this.emplacement.numero}],{ relativeTo: this.route })
      });
    }
  }

}
