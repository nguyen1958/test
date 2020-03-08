import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Requetes } from '../../models/Requetes';
import { CustomValidators } from '../../shared/custom.validators';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-batch-traitement',
  templateUrl: './batch-traitement.component.html',
  styleUrls: ['./batch-traitement.component.css']
})
export class BatchTraitementComponent implements OnInit {

  mois=[1,2,3,4,5,6,7,8,9,10,11,12];
  trimestre=[1,2,3,4];
  taxes=[];anneeTlpe=[];
  formTraitement:FormGroup;loadingPrefacturation=false;loadingFacturation=false;
  formFilien:FormGroup;loadingFilien=false;
  formRelance:FormGroup;loadingRelance=false;
  formErrors:{[key:string]:any}={};
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }
  retourTraitement=null;
  retourFilien=null;
  retourRelance=null;
  //Cacher les parties batchs
  hiddenTraitement=false;
  hiddenFilien=true;
  hiddenRelance=true;
  
  constructor(private fb:FormBuilder,
    private httpService:HttpService,
    private route:ActivatedRoute,
    private router:Router) { }

  ngOnInit() {
    let anneeCourante=new Date().getFullYear();
    for(let i=0;i<10;i++){
      this.anneeTlpe[i]=anneeCourante-i;
    }
    this.httpService.post("requestSql",Requetes.taxes)
    .subscribe(data=>{
      this.taxes=data;
    });

    this.formTraitement=this.fb.group({
      etapeFacturation:this.fb.control(''),
      dateExecution:this.fb.control(new Date().toLocaleDateString(),Validators.required),
      typeTaxe:this.fb.control('',Validators.required),
      anneeFacturationTLPE:this.fb.control(this.anneeTlpe[0])
    });
    this.formFilien=this.fb.group({
      choix:this.fb.control('t'),
      trimestre:this.fb.control('1')
    });
    this.formRelance=this.fb.group({
      choix:this.fb.control('m'),
      mensuel:this.fb.control('1'),
      trimestre:this.fb.control('1')
    });

    this.formTraitement.valueChanges.subscribe(()=>{
      CustomValidators.detectErrors(this.formTraitement,this.formErrors);
  });

  }
/**
 * Mettre à jour les propriétés du formulaire à envoyer:
 * le etapefacturation et la date en format jj/mm/yyyy
 */
  lancerTraitement(etape){
    switch(etape){
      case "preFacturation":this.loadingPrefacturation=true;
      break;
      case "facturation":this.loadingFacturation=true;
    }
    this.formTraitement.patchValue({etapeFacturation:etape,
              dateExecution:typeof this.formTraitement.value.dateExecution=='string'?
              this.formTraitement.value.dateExecution:
              this.formTraitement.value.dateExecution.toLocaleDateString()})
    console.log(etape,this.formTraitement.value)
    this.httpService.post('lancerBatchTraitement',this.formTraitement.value)
      .subscribe(data=>{
        if(etape=='facturation') this.loadingFacturation=false
        else this.loadingPrefacturation=false;
        this.retourTraitement=data;
        console.log("retour lancerTraitement\n",data)
      });
  }
  
  lancerFilien(){
    this.loadingFilien=true;
    this.httpService.post('lancerBatchFilien',this.formFilien.value)
    .subscribe(data=>{
      this.loadingFilien=false;
      console.log("retour lancerFilien\n",data)
      this.retourFilien={...data,valide:false};
    });
    console.log(this.formFilien.value)

  }

  lancerRelance(){
    this.loadingRelance=true;
    this.httpService.post('lancerBatchRelance',this.formRelance.value)
    .subscribe(data=>{
      this.loadingRelance=false;
      this.retourRelance=data;
      console.log("retour lancerRelance\n",data)
    });
    console.log(this.formRelance)
  }

}
