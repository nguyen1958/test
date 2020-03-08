import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Requetes } from '../../models/Requetes';
import { CustomValidators } from '../../shared/custom.validators';

@Component({
  selector: 'app-rapports',
  templateUrl: './rapports.component.html',
  styleUrls: ['./rapports.component.css']
})
export class RapportsComponent implements OnInit {
  form:FormGroup;
  taxes=[];
  formErrors:{[key:string]:any}={};
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }
  action="rechercher";
  loadingSF=false;loadingCAR=false;
  resultatDe="";
  resultatSF;resultatCAR;
  retourSuiviFacturation;retourChangementAdresse;
  constructor(private httpService:HttpService,
              private fb:FormBuilder) { }

  ngOnInit() {
    this.httpService.post("requestSql",Requetes.taxes)
    .subscribe(data=>{
      this.taxes=data;
    });
    this.form=this.fb.group({
      debutPeriode:this.fb.control('',Validators.required),
      finPeriode:this.fb.control('',Validators.required),
      typeTaxe:this.fb.control('')
    });
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
    });
  }

  rechercherSF(){
    console.log("rechercher suivi facturation")
    this.loadingSF=true;
    this.resultatDe="suiviFacturation";
    let req="From BatchSuiviFacturation order by id desc";
    this.httpService.post("requestSql",req)
          .subscribe(data=>{
            this.resultatSF=data;
            this.loadingSF=false;
          })        
  }

  rechercherCAR(){
    console.log("rechercher changement d'adresse des redevables")
    this.resultatDe="changementAdresse";
    this.loadingCAR=true;
    let req="From BatchChangementAdresseRedevable where fichierCree='true' order by id desc";
    this.httpService.post("requestSql",req)
          .subscribe(data=>{
            this.resultatCAR=data;
            this.loadingCAR=false;
          })          
  }

  //Visualiser le document
  getUrl(role,numeroBatch){
    let path=role+"_"+numeroBatch+".pdf";
    return encodeURI(`${this.httpService.apiUrl}/showFile?type=${role}&path=${path}`);
  }

  lancerBatchSuiviFacturation(){
    this.loadingSF=true;
    this.form.patchValue({
      debutPeriode:typeof this.form.value.debutPeriode=='string'?
      this.form.value.debutPeriode:
      this.form.value.debutPeriode.toLocaleDateString(),
      finPeriode:typeof this.form.value.finPeriode=='string'?
      this.form.value.finPeriode:
      this.form.value.finPeriode.toLocaleDateString()   
    });
    this.httpService.post("genererRapport",{codeRapport:'RSF',
                                            typeTaxe:this.form.value.typeTaxe,
                                            dateDebutPeriode:this.form.value.debutPeriode,
                                            dateFinPeriode:this.form.value.finPeriode})
      .subscribe(data=>{//type retour dtoRapport
        this.retourSuiviFacturation=data;
        this.loadingSF=false;
        console.log(data)
      })
    console.log(this.form.value)

  }

  lancerBatchChangementAdresse(){
    this.loadingCAR=true;
    this.httpService.post("genererRapport",{codeRapport:'RCAR'})
      .subscribe(data=>{//type retour dtoRapport
        this.retourChangementAdresse=data;
        this.loadingCAR=false;
        console.log(data)
      })
  }

}
