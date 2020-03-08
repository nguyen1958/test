import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Requetes } from '../../models/Requetes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../shared/custom.validators';


@Component({
  selector: 'app-modification-marche',
  templateUrl: './modification-marche.component.html',
  styleUrls: ['./modification-marche.component.css']
})
export class ModificationMarcheComponent implements OnInit {
  title=`AJOUTER UN MARCHE`;
  idMarche;
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  constructor(private fb:FormBuilder,
              private httpService:HttpService,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.form=this.fb.group({
      idMarche:this.fb.control(''),
      nomMarche:this.fb.control('',Validators.required)
    });
    this.route.paramMap.subscribe(params=>{
      this.idMarche=params.get('id');
      this.initialize()
    });

  }

  initialize(){
    if(this.idMarche){
      this.title=`Modification du marché : ${this.idMarche}`;
      this.httpService.post("requestSql",Requetes.marcheById(this.idMarche))
          .subscribe(data=>this.form.patchValue(data[0]));  
    };
    //if any field is changed, vérifier erreur du formulaire 
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
    });
  }

  onTouch(){
    CustomValidators.detectErrors(this.form,this.formErrors);
  }

  onValider(){
    this.httpService.post("saveMarche",this.form.value)
    .subscribe(data => {
      this.router.navigate(['.',{id:data.idMarche}],{ relativeTo: this.route })
    })
  }

  onSupprimer(){
    console.log("supprimer",this.form.value.idMarche);
    if(confirm("Vous voulez vraiment supprimer ce marché ?")){
      this.httpService.post("deleteMarche",this.form.value.idMarche)
      .subscribe(data => {
        //retourner à liste des marchés
        this.router.navigate(['../Marché'],{ relativeTo: this.route })
      });
    }
  }

}
