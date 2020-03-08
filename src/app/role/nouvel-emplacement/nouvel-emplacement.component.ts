import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { CustomValidators } from '../../shared/custom.validators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nouvel-emplacement',
  templateUrl: './nouvel-emplacement.component.html',
  styleUrls: ['./nouvel-emplacement.component.css']
})
export class NouvelEmplacementComponent implements OnInit {
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  secteurs;taxes;
  souscriptions=[];
  numRedevable;

  constructor(private router:Router,
              private route:ActivatedRoute,
              private httpService:HttpService,
              private fb:FormBuilder) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params=> this.numRedevable=params.get('numRedevable'));
    this.souscriptions.push(
      forkJoin(
      this.httpService.post("requestSql", Requetes.listevaleursByType('code_secteur')),
      this.httpService.post("requestSql", Requetes.taxes))
      .subscribe(([r1, r2]) => {
        this.secteurs = r1.sort((a,b)=>{
          if(parseInt(a.valeur,10)<parseInt(b.valeur,10)) return -1
          if(parseInt(a.valeur,10)==parseInt(b.valeur,10)) return 0
          if(parseInt(a.valeur,10)>parseInt(b.valeur,10)) return 1
        });
        this.taxes = r2;
      })
    );

    this.form=this.fb.group({
      taxe:['',Validators.required],
      secteur:['',Validators.required],
      noEmplacement:['',Validators.required],
      annee:[new Date().getFullYear(),Validators.required]
    });

    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors)
    });
  }
  
  ngOnDestroy() {
    console.log("ngOnDestroy of nouvel-emplacement")
    this.souscriptions.forEach(s => s.unsubscribe());
  }

  onTouch(){
    CustomValidators.detectErrors(this.form,this.formErrors)
  }

  valider(){
    console.log("form",this.form);
    this.router.navigate(['../Modification de l\'emplacement',
                          {numRedevable:this.numRedevable,
                           idTaxe:this.form.value.taxe,
                           secteur:this.form.value.secteur,
                           numeroPersonalise:this.form.value.noEmplacement,
                           annee:this.form.value.annee}],
                           { relativeTo: this.route});
  }
}
