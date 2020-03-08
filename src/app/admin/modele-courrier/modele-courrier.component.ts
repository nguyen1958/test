import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../shared/custom.validators';

@Component({
  selector: 'app-modele-courrier',
  templateUrl: './modele-courrier.component.html',
  styleUrls: ['./modele-courrier.component.css']
})
export class ModeleCourrierComponent implements OnInit {
  nomRecherche="";
  modeleCourriers=[];
  modeleSelected:File;
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  constructor(private fb:FormBuilder,
    private httpService:HttpService) { }


  ngOnInit() {
    this.form=this.fb.group({
      nomRecherche:[''],
      file:['',Validators.required],
      nomModele:['',Validators.required],
    }); 
    //if any field is changed, vérifier erreur du formulaire 
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
    }); 
    this.initialize();
  }

  initialize(){
    this.modeleSelected=null;
    this.httpService.post("requestSql","select o from ModeleCourrier o order by o.nomModele")
    .subscribe(data =>this.modeleCourriers=data);
  }

  rechercher(){
    let req="select o from ModeleCourrier o ";
    let where=" Where";
    if (this.form.value.nomRecherche != "") where += " o.nomModele like '%" + this.form.value.nomRecherche+"%'";
    if (where.length > 6) req += where;
    req+=" order by o.nomModele";
    this.httpService.post("requestSql",req)
        .subscribe(data =>this.modeleCourriers=data);
  }

  onChange(event){
    console.log(event);
    this.modeleSelected=event.target.files[0] as File;
  }

  onValider(){
    console.log("valider",this.form.value);
    const fd:FormData=new FormData();
    fd.append("file",this.modeleSelected,this.modeleSelected.name);
    fd.append("nomModele",this.form.value.nomModele);
    this.httpService.post("saveModeleCourrier",fd)
    .subscribe(data=>{
      this.initialize();
      this.form.reset();
    });
  }

  delete(index){
    console.log("delete",index)
    const fd:FormData=new FormData();
    fd.append("id",this.modeleCourriers[index].id);
    this.httpService.post("deleteModeleCourrier",fd)
        .subscribe(data =>this.initialize());
  }

}
