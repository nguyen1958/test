import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Requetes } from '../../models/Requetes';
import { CustomValidators } from '../../shared/custom.validators';

@Component({
  selector: 'app-modification-utilisateur',
  templateUrl: './modification-utilisateur.component.html',
  styleUrls: ['./modification-utilisateur.component.css']
})
export class ModificationUtilisateurComponent implements OnInit {
  id;title;
  typeUtilisateurs=[];
  taxes=[];
  taxeAutorises=[];
  utilisateur;
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  constructor(private fb:FormBuilder,
              private httpService:HttpService,
              private router:Router,
              private route:ActivatedRoute) {}

  ngOnInit() {
    //invoquer lorsqu'il y a changement valeur de params
    this.route.paramMap.subscribe(params=>{
        this.id=params.get('id');
        //Modification d'un utilisateur
        this.title=this.id?`Modification du profil d'utilisateur : ${this.id}`:`Ajout d'un utilisateur`;
        this.initialize()
    });
  };

  initialize(){
    this.form=this.fb.group({    
      numeroUser:this.fb.control(null),
      nom:this.fb.control('',Validators.required),
      prenom:this.fb.control('',Validators.required),
      login:this.fb.control('',Validators.required),
      password:this.fb.control('',Validators.required),
      valide:this.fb.control('OUI',Validators.required),
      ensembleUtilisateur:this.fb.control('',Validators.required),
      remarque:this.fb.control(''),    
      taxeAutorises:this.fb.array([])
    });
    forkJoin(
      this.httpService.post("requestSql",Requetes.utilisateurById(this.id)),
      this.httpService.post("requestSql",Requetes.droitAccesByUser(this.id)),
      this.httpService.post("requestSql",Requetes.listevaleursByType('type_utilisateur')),
      this.httpService.post("requestSql",Requetes.taxes)      
    ).subscribe(([r1,r2,r3,r4])=>{
      this.utilisateur=r1[0];
      this.taxeAutorises=r2;
      this.typeUtilisateurs=r3;
      this.taxes=r4;
      //On affecte les valeurs au formulaire
      this.form.patchValue({...this.utilisateur});
      //Créer des taxes autorisées
      this.taxes.forEach(taxe=>{
        let groupTaxe=this.fb.group({
          idTaxe:this.fb.control(taxe.id.idImputation),
          isChecked:this.fb.control(this.isAutorise(taxe))
        });
        (this.form.controls.taxeAutorises as FormArray).push(groupTaxe);
      });
    });

    //if any field is changed, vérifier erreur du formulaire 
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
    });

  }

  isAutorise(taxe){
    return this.taxeAutorises
            .find(element=>element.idImputation==taxe.id.idImputation)?true:false;
  }

  onValider(){
    console.log("valider",this.form.value);
    this.httpService.post("saveUtilisateur",this.form.value)
      .subscribe(data => {
        console.log("retour valider",data);
        if(!this.form.value.numeroUser){//passage de creer user To modifier user
          this.router.navigate(['./',{id:data.numeroUser}],{ relativeTo: this.route })
        }
    });
  }

}
