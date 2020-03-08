import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Requetes } from '../../models/Requetes';
import { CustomValidators } from '../../shared/custom.validators';

@Component({
  selector: 'app-modification-rue',
  templateUrl: './modification-rue.component.html',
  styleUrls: ['./modification-rue.component.css']
})
export class ModificationRueComponent implements OnInit {
  title=`Ajouter une rue`;
  //Initialiser un tableau avec 0 utilisé pour le tag select séquence des numéros
  numerodebut=Array(499).fill(0);
  numerofin=Array(500).fill(0);
  marches;secteurs;quartiers;
  id;rue;
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  constructor(private fb:FormBuilder,
    private httpService:HttpService,
    private router:Router,
    private route:ActivatedRoute) { }

  ngOnInit() {
    forkJoin(this.httpService.post("requestSql",Requetes.marches),
             this.httpService.post("requestSql",Requetes.listevaleursByType('code_secteur')),
             this.httpService.post("requestSql",Requetes.quartiers))
    .subscribe(([r1,r2,r3])=>{
        this.marches=r1;
        this.secteurs=r2;
        this.quartiers=r3;
    });
    this.form=this.fb.group({
      codeVoie:this.fb.control(null),  
      codeSecteur:this.fb.control(''),
      prefixe:this.fb.control('',Validators.required),
      liaison:this.fb.control(''),
      nomrue:this.fb.control('',Validators.required),
      codeRivolie:this.fb.control('',Validators.required),
      debutNumeroRue:this.fb.control('1',Validators.required),
      finNumeroRue:this.fb.control('500',Validators.required),
      codePostal:this.fb.control('',Validators.required),
      nomquartier:this.fb.control('',Validators.required),
      selectionQuartier:this.fb.control(''),
      idMarche:this.fb.control(''),
      remarqueRue:this.fb.control('')
    });
    this.route.paramMap.subscribe(params=>{
      this.id=params.get('id');
      this.initialize();
    });

  }

  initialize(){
    //Modifier une rue
    if(this.id){
      this.httpService.post("requestSql",Requetes.rueById(this.id))
        .subscribe(data=>{
          this.rue=data[0];
          //titre
          this.title=`Modifier la rue : ${this.id}`;
          //On affecte les valeurs au formulaire
          this.form.patchValue({...this.rue});
        });
    }     
    //if any field is changed, vérifier erreur du formulaire 
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
    });

  }

  onSelect(){
    this.form.get('nomquartier').setValue(this.form.get('selectionQuartier').value);
  }

  onValider(){
    this.httpService.post("saveRue",this.form.value)
    .subscribe(data => {
      this.router.navigate(['./',{id:data.codeVoie}],{ relativeTo: this.route })
    })
  }

}
