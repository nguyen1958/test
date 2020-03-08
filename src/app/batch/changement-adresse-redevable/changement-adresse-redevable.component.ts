import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { CustomValidators } from '../../shared/custom.validators';
import { Requetes } from '../../models/Requetes';

@Component({
  selector: 'app-changement-adresse-redevable',
  templateUrl: './changement-adresse-redevable.component.html',
  styleUrls: ['./changement-adresse-redevable.component.css']
})
export class ChangementAdresseRedevableComponent implements OnInit {
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  rues=[];redevables=[];
  constructor(private route:ActivatedRoute,
    private router:Router,
    private httpService:HttpService,
    private fb:FormBuilder) { }

  ngOnInit() {
    this.form=this.fb.group({
      numRedevable:['',Validators.required],
      nomRedevable:[''],
      adrRedevable:[''],
      choixRedevable:['',Validators.required],
      numVoie:['',[Validators.required,CustomValidators.entier]],
      codeVoie:['',Validators.required],
      nomVoie:[''],
      choixAdresse:['',Validators.required],
      adresse2:[''],
      adresse3:[''],
      ville:['',Validators.required],
      codePostal:['',Validators.required],
      cedex:['']
    });
    this.form.valueChanges.subscribe(()=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
    });
  }
  onSearchRedevable(){
    console.log("onSearchRedevable");
    let reqSql:string="from Redevable ";
    let where="where";
    if(this.form.value.numRedevable!="") where+=` and numredevable=${this.form.value.numRedevable}`;
    if(this.form.value.nomRedevable!="") where+=` and concat(nomRedevable,' ',prenom) like '%${this.form.value.numRedevable}%'`;
    if(this.form.value.adrRedevable!="") where+=` and concat(numrue,' ',adresse1,' ',adresse2,' ',adresse3) like '%${this.form.value.adrRedevable}%'`;
    if (where.length > 5){
      where = where.replace("and", "");
      reqSql+=where+" order by numRedevable";
      this.httpService.post("requestSql", reqSql)
                    .subscribe(data => {
                                this.redevables=data;
                                this.form.patchValue({choixRedevable:this.redevables[0],
                                                      numRedevable:this.redevables[0].numRedevable})
                              });
    }
  }
  redevableSelected(){
    console.log(this.form.value.choixRedevable);
    this.form.patchValue({numRedevable:this.form.value.choixRedevable.numRedevable})
  }
  onSearchRueBy(key:string){
    console.log("onSearchRueBy",key);
    let reqSql:string;
    let nomVoie:string;
    switch(key){
      case "code":  reqSql=`from Rue Where codeVoie like '${this.form.value.codeVoie}%' order by codeVoie`;
                    break;
      case "nom":   nomVoie=this.form.value.nomVoie.replace("'","''");
                    reqSql=`from Rue Where concat(prefixe,' ',liaison,' ',nomrue) like '%${nomVoie}%' order by codeVoie`;                   
                    break;
    }
    this.httpService.post("requestSql", reqSql)
    .subscribe(data => {
      this.rues=data;
      this.form.patchValue({choixAdresse:this.rues[0],
                            codeVoie:this.rues[0].codeVoie})
    });
  }

  rueSelected(){
    console.log(this.form.value.choixAdresse);
    this.form.patchValue({codeVoie:this.form.value.choixAdresse.codeVoie})
  }

  validerChangementAdresse(){
    if(confirm(`Etes-vous sûr de vouloir changer l'adresse du redevable numero ${this.form.value.choixRedevable.numRedevable}`)){
      this.httpService.post("changementAdresse",this.form.value)
      .subscribe(data=>{//type retour dtoRapport
        console.log("Retour changement adresse");
        this.form.reset();
        alert("Opération validée avec succès")
      })
    }    
  }
}
