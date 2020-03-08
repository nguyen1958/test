import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { CustomValidators } from '../../shared/custom.validators';

@Component({
  selector: 'app-batch-rapport-comptable',
  templateUrl: './batch-rapport-comptable.component.html',
  styleUrls: ['./batch-rapport-comptable.component.css']
})
export class BatchRapportComptableComponent implements OnInit {
  mois=[1,2,3,4,5,6,7,8,9,10,11,12];
  trimestre=[1,2,3,4];
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  retourBatch=null;
  loadingJournalier=false;
  loadingMensuel=false;
  loadingTrimestriel=false;
  loadingAnnuel=false;
  loadingMarche=false;
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }
  constructor(private fb:FormBuilder,
              private httpService:HttpService) { }

  ngOnInit() {
    this.form=this.fb.group({
      date:this.fb.control(new Date().toLocaleDateString(),Validators.required),
      mois:this.fb.control('1',Validators.required),
      trimestre:this.fb.control('1',Validators.required),
      annee:this.fb.control(new Date().getFullYear(),Validators.required),
      dateMarche:this.fb.control(new Date().toLocaleDateString(),Validators.required),
      dateDebutControl:this.fb.control(new Date().toLocaleDateString(),Validators.required),
      dateFinControl:this.fb.control(new Date().toLocaleDateString(),Validators.required),
    });
    this.form.valueChanges.subscribe(()=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
    });
  }

  lancerRapport(typeRapport){
    this.retourBatch=null;
    let dateComptable=typeof this.form.value.date=='string'?this.form.value.date:this.form.value.date.toLocaleDateString();
    let dateMarche=typeof this.form.value.date=='string'?this.form.value.date:this.form.value.date.toLocaleDateString();
    let periode="";
    switch(typeRapport){
      case 'j':this.loadingJournalier=true;periode=dateComptable;break;
      case 'm':this.loadingMensuel=true;periode=this.form.value.mois;break;
      case 't':this.loadingTrimestriel=true;periode=this.form.value.trimestre;break;
      case 'a':this.loadingAnnuel=true;periode=this.form.value.annee;break;
      case 'marche':this.loadingMarche=true;periode=dateMarche;break;
    }
    this.httpService.post('lancerBatchRapportComptable',{typeRapport:typeRapport,periode:periode})
      .subscribe(data=>{
        this.loadingJournalier=false;this.loadingMensuel=false;
        this.loadingTrimestriel=false;this.loadingAnnuel=false;this.loadingMarche=false;
        this.retourBatch=data;
        console.log("retour lancerBatchRapportComptable\n",data)
      });
    console.log(this.form);
  }

  showRapport(typeRapport){
    let dateDebut=typeof this.form.value.dateDebutControl=='string'?this.form.value.dateDebutControl:this.form.value.dateDebutControl.toLocaleDateString();
    let dateFin=typeof this.form.value.dateFinControl=='string'?this.form.value.dateFinControl:this.form.value.dateFinControl.toLocaleDateString();
    window.open(this.httpService.apiUrl+
      `/showReport?typeRapport=${typeRapport}&dateDebut=${dateDebut}&dateFin=${dateFin}`);
  }
}
