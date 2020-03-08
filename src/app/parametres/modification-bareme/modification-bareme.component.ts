import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Requetes } from '../../models/Requetes';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomValidators } from '../../shared/custom.validators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-modification-bareme',
  templateUrl: './modification-bareme.component.html',
  styleUrls: ['./modification-bareme.component.css']
})
export class ModificationBaremeComponent implements OnInit {
  title=`Ajouter un barème`;
  id;annee;bareme;taxe;tarifBareme;
  taxes;uniteTravails;uniteTemps;typeArrondis;
  nbArticles;
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  constructor(private fb:FormBuilder,
              private httpService:HttpService,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.form=this.fb.group({
      id:this.fb.group({
        code:this.fb.control(null),
        anExercice:this.fb.control(new Date().getFullYear()),
      }),
      idImputation:this.fb.control('',Validators.required),
      libelle:this.fb.control(''),
      sectionBareme:this.fb.control(''),
      imputationBareme:this.fb.control(''),
      uniteDeTravail:this.fb.control('',Validators.required),
      dureeUnitaire:this.fb.control('',Validators.required),
      typeArrondi:this.fb.control('',Validators.required),
      prorata:this.fb.control('',Validators.required),
      periodicite:this.fb.control('false',Validators.required),
      prixPeriode1:this.fb.control('0.0',CustomValidators.decimal),
      prixPeriode2:this.fb.control('0.0',CustomValidators.decimal),
      prixPeriode3:this.fb.control('0.0',CustomValidators.decimal),
      prixPeriode4:this.fb.control('0.0',CustomValidators.decimal),
      prixPeriode5:this.fb.control('0.0',CustomValidators.decimal),
      prixUnit:this.fb.control('',[Validators.required,CustomValidators.decimal]),
      coefficientNumerique:this.fb.control(''),
      tranchePrix:this.fb.array([])
    });
    //Résultat fournit par le resolver définit au niveau du routage
    //forkjoin retourne un tableau de resultat de requete qui eux meme un tableau
    this.route.data.subscribe(data => {
      this.taxes=data.resultat[0];
      this.uniteTravails=data.resultat[1];
      this.uniteTemps=data.resultat[2];
      this.typeArrondis=data.resultat[3];
    });
    this.route.paramMap.subscribe(params=>{
        this.id=params.get('id');
        this.annee=params.get("annee");
        this.initialize()
    })
  }

  initialize(){
    console.log("Requetes.baremeById(id,annee):",this.id,this.annee);
    //Modification d'un bareme
    if(this.id){
        forkJoin(
          this.httpService.post("requestSql",Requetes.baremeById(this.id,this.annee)),
          this.httpService.post("requestSql",Requetes.tarifBaremeById(this.id,this.annee))
        ).subscribe(([r1,r2])=>{
          this.bareme=r1[0].bareme;
          this.nbArticles=r1[0].nbArticles;
          this.taxe=r1[0].taxe;
          this.tarifBareme=r2;
          //titre
          this.title=`Modification du barème : ${this.bareme.id.code}`;
          //On affecte les valeurs du bareme au formulaire
          this.form.patchValue(this.bareme);
          //Remove les composants formArray s'il existe
          (<FormArray>this.form.get('tranchePrix')).controls=[];
          //Créer des tranches de prix
          (this.tarifBareme as Array<any>).forEach(data=>{
            this.addTranchePrix(data);
          })
        });
    }
      
    //if any field is changed, vérifier erreur du formulaire 
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
      console.log(this.form)
    });
  }

  groupeTranchePrix(tarif?):FormGroup{
    return tarif? 
    this.fb.group({
      surfaceMin:this.fb.control(tarif.surfaceMin,[Validators.required,CustomValidators.decimal]),
      surfaceMax:this.fb.control(tarif.surfaceMax,[Validators.required,CustomValidators.decimal]),
      prix:this.fb.control(tarif.prix,[Validators.required,CustomValidators.decimal])
    })
    :
    this.fb.group({
      surfaceMin:this.fb.control('0.00',[Validators.required,CustomValidators.decimal]),
      surfaceMax:this.fb.control('0.00',[Validators.required,CustomValidators.decimal]),
      prix:this.fb.control('0.00',[Validators.required,CustomValidators.decimal])
    })
  }

  onTouch(){
    CustomValidators.detectErrors(this.form,this.formErrors);
  }

  addTranchePrix(tarif?):void{
    (<FormArray>this.form.get('tranchePrix')).push(this.groupeTranchePrix(tarif));
  }

  removeTranchePrix(tranchePrixIndex:number):void{
    (<FormArray>this.form.get('tranchePrix')).removeAt(tranchePrixIndex);
  }
  //Update validators selon type de taxe
  onChangeTaxe(){
    this.taxe=this.taxes.find(data=>data.id.idImputation==this.form.value.idImputation);
    const prixUnitControl=this.form.get('prixUnit');
    if(this.taxe.libelle=='TLPE'){
      prixUnitControl.clearValidators();prixUnitControl.updateValueAndValidity();
    }
    else{
      prixUnitControl.setValidators([Validators.required,CustomValidators.decimal]);prixUnitControl.updateValueAndValidity();
    }
  }

  onValider(){
    console.log("valider",this.form.value);
    this.httpService.post("saveBareme",this.form.value)
    .subscribe(data => {
      console.log("retour valider",data);    
      this.router.navigate(['.',{id:data.id.code,annee:data.id.anExercice}],{ relativeTo: this.route }) 
    });
  }

  onSupprimer(){
    console.log("supprimer",this.form.value.id);
    if(confirm("Vous voulez vraiment supprimer ce bareme ?")){
      this.httpService.post("deleteBareme",this.form.value.id)
      .subscribe(data => {
        //retourner à liste des baremes
        this.router.navigate(['../Barème'],{ relativeTo: this.route })
      });
    }
  }


}
