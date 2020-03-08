import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from '../../shared/custom.validators';
import { Requetes } from '../../models/Requetes';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-modification-taxe',
  templateUrl: './modification-taxe.component.html',
  styleUrls: ['./modification-taxe.component.css']
})
export class ModificationTaxeComponent implements OnInit {

  title=`CREATION D'UN TYPE DE TAXE`;
  id;annee;taxe;
  marches;typeFacturations;
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  constructor(private fb:FormBuilder,
              private httpService:HttpService,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {
    forkJoin(this.httpService.post("requestSql",Requetes.marches),
             this.httpService.post("requestSql",Requetes.listevaleursByType('typeFacturation')))
    .subscribe(([r1,r2])=>{
        this.marches=r1;
        this.typeFacturations=r2;
        this.form.get('typeFacturation').setValue(this.typeFacturations[0].valeur);
    });
    this.form=this.fb.group({
      id:this.fb.group({
        idImputation:this.fb.control(null),
        anneeExercice:this.fb.control(new Date().getFullYear())
      }),
      libelle:this.fb.control('',Validators.required),
      designation:this.fb.control('',Validators.required),
      codeBudget:this.fb.control('',Validators.required),
      code:this.fb.control('',Validators.required),
      section:this.fb.control('',Validators.required),
      minimumPerception:this.fb.control('0.00',[Validators.required,CustomValidators.decimal]),
      minimumDeFacturation:this.fb.control('0.00',CustomValidators.decimal),
      codeFonction:this.fb.control(''),
      libelleFonction:this.fb.control(''),
      codeCentreResponsable:this.fb.control(''),
      libelleCentreResponsable:this.fb.control(''),
      codeCentreExecution:this.fb.control(''),
      libelleCentreExecution:this.fb.control(''),
      marche:this.fb.control(''),
      necessiteControleTerrain:this.fb.control('OUI'),
      controleInduitFacturation:this.fb.control('OUI'),
      typeFacturation:this.fb.control('',Validators.required),
      cycleFacturation:this.fb.control('Normal'),
      renouvellementAutomatique:this.fb.control('Non'),
      nomGestionnaire:this.fb.control(''),
      telGestionnaire:this.fb.control(''),
      faxGestionnaire:this.fb.control(''),
      nomElu:this.fb.control(''),
      eluRenseignement1:this.fb.control(''),
      eluRenseignement2:this.fb.control(''),
      eluRenseignement3:this.fb.control(''),
      chapitre:this.fb.control(''),
      nature:this.fb.control(''),
      fonction:this.fb.control(''),
      codeOpeEquipement:this.fb.control(''),
      typeMouvement:this.fb.control('',[CustomValidators.pattern(/^[R,O,I]$/)]),
      sens:this.fb.control('',[CustomValidators.pattern(/^[R,D]$/)]),
      codeSegStructurelle:this.fb.control(''),
      codeEleStructurelleGestionnaire:this.fb.control(''),
      codeEleStructurelleDestinataire:this.fb.control(''),
      codeSegOperationnel:this.fb.control(''),
      codeEleOperationnel:this.fb.control(''),
      codeSegment1:this.fb.control(''),
      codeEleSectoriel1:this.fb.control(''),
      codeSegment2:this.fb.control(''),
      codeEleSectoriel2:this.fb.control(''),
      codeSegment3:this.fb.control(''),
      codeEleSectoriel3:this.fb.control(''),
      codeSegment4:this.fb.control(''),
      codeEleSectoriel4:this.fb.control(''),
      codeSegment5:this.fb.control(''),
      codeEleSectoriel5:this.fb.control(''),
      codeSegStrategique:this.fb.control(''),
      codeEleStrategique:this.fb.control('')
    });
    
    this.route.paramMap.subscribe(params=>{
        this.id=params.get('id');
        this.annee=params.get("annee");
        this.initialize();
    })
   
  }

  initialize(){
     //Modification d'un bareme
     console.log("initialize",this.id)
     if(this.id){
      this.httpService.post("requestSql",Requetes.taxeById(this.id,this.annee))
        .subscribe(data=>{
          this.taxe=data[0];
          //titre
          this.title=`MODIFICATION DU TYPE DE TAXE : ${this.taxe.id.idImputation}`;
          //On affecte les valeurs au formulaire
          this.form.patchValue(this.taxe);
        });
    }   
    //if any field is changed, vérifier erreur du formulaire 
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
    });
  }

  onValider(){
    console.log("valider",this.form.value);
    this.httpService.post("saveImputation",this.form.value)
    .subscribe(data => {
      console.log("retour valider",data);
      this.router.navigate(['./',{id:data.id.idImputation,annee:data.id.anneeExercice}],{ relativeTo: this.route })
    });
  }
}
