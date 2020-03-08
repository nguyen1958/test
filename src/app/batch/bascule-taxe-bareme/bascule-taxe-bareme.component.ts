import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { CustomValidators } from '../../shared/custom.validators';
import { Requetes } from '../../models/Requetes';

@Component({
  selector: 'app-bascule-taxe-bareme',
  templateUrl: './bascule-taxe-bareme.component.html',
  styleUrls: ['./bascule-taxe-bareme.component.css']
})
export class BasculeTaxeBaremeComponent implements OnInit {
  form1:FormGroup;
  form1Errors:{[key:string]:any}={};
  form2:FormGroup;
  form2Errors:{[key:string]:any}={};
  anneeCourante=new Date().getFullYear();
  taxes=[];
  dejaBascule=false;
  bascule;
  constructor(private route:ActivatedRoute,
    private router:Router,
    private httpService:HttpService,
    private fb:FormBuilder) { }

  ngOnInit() {
    this.form1=this.fb.group({
      deAnnee:[this.anneeCourante,Validators.required],
      versAnnee:[this.anneeCourante+1,Validators.required],
      pourcentage:['',[CustomValidators.decimal,Validators.required]]
    });
    this.form1.valueChanges.subscribe(()=>{
      CustomValidators.detectErrors(this.form1,this.form1Errors);
    });
    this.form2=this.fb.group({
      typeTaxe:['',Validators.required]
    });
    this.form2.valueChanges.subscribe(()=>{
      CustomValidators.detectErrors(this.form2,this.form2Errors);
    });
    this.httpService.post("requestSql", Requetes.taxes)
        .subscribe(data=>this.taxes=data);
    //Voir si bascule est déjà effectuée
    this.httpService.post("requestSql",`from HistoriqueBascule where deAnnee=${this.anneeCourante}`)
        .subscribe(data=>{
           if(data.length>0) {
             this.dejaBascule=true;
             this.bascule=data[0];
           }
        })
  }

  basculerTaxeEtBareme(){
    if(confirm(`Etes-vous sûr de vouloir basculer tous les taxes et les baremes
                de l'année ${this.anneeCourante} à l'année ${this.anneeCourante+1} ?`)){
      this.httpService.post("basculeTaxeEtBareme",this.form1.value)
                .subscribe(data=>{
                  alert(`Opération effectuée avec succès`)
                })
    }
  }

  basculerUneTaxe(){
    if(confirm(`Etes-vous sûr de vouloir faire la bascule de la taxe ${this.form2.value.typeTaxe} ?`)){
      this.httpService.post("basculerUneTaxe",this.form2.value.typeTaxe)
                .subscribe(data=>{
                  alert(`Opération effectuée avec succès`)
                })
    }
  }

}
