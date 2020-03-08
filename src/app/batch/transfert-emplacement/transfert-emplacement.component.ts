import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { CustomValidators } from '../../shared/custom.validators';
import { Requetes } from '../../models/Requetes';

@Component({
  selector: 'app-transfert-emplacement',
  templateUrl: './transfert-emplacement.component.html',
  styleUrls: ['./transfert-emplacement.component.css']
})
export class TransfertEmplacementComponent implements OnInit {
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  emplacements=[];redevables=[];
  constructor(private route:ActivatedRoute,
    private router:Router,
    private httpService:HttpService,
    private fb:FormBuilder) { }

  ngOnInit() {
    this.form=this.fb.group({
      numEmplacement:[''],
      nomEmplacement:[''],
      adrEmplacement:[''],
      choixEmplacement:['',Validators.required],
      numRedevable:[''],
      nomRedevable:[''],
      adrRedevable:[''],
      choixRedevable:['',Validators.required]
    });
    this.form.valueChanges.subscribe((data)=>{
      //console.log("form.Changed\n",data)
      CustomValidators.detectErrors(this.form,this.formErrors);
    });
    this.route.paramMap.subscribe(params=>{
        let numero=params.get('numero');
        console.log("params.numero",numero)
        if(numero){
          this.form.patchValue({numEmplacement:numero});
          this.onSearchEmplacement();
        }
    });
  }
  //Recherche emplacement avec nb facture trouvé
  onSearchEmplacement(){
    let reqSql=`select distinct new map( e as emplacement, count(f.numeroFacture) as nbFacture)
                from Emplacement e
                left join ElementFacturation ef on e.numero=ef.numeroEmplacement
                left join Article a on ef.numero=a.idElementFacturation
                left join LigneFacture lf on lf.idArticle=a.idArticle
                left join Facture f on lf.idFacture=f.numeroFacture `;
    let where="where e.source='normal'";
    console.log(where.length)
    if(this.form.value.numEmplacement!="") where+=` and e.numero=${this.form.value.numEmplacement}`;
    if(this.form.value.nomEmplacement!="") where+=` and e.raisonSocial like '%${this.form.value.nomEmplacement}%'`;
    if(this.form.value.adrEmplacement!="") where+=` and concat(numrue,' ',adresse1,' ',adresse2,' ',adresse3) like '%${this.form.value.adrEmplacement}%'`;
    if (where.length > 23){
      reqSql+=where+" group by e.numero order by e.numero";
      this.httpService.post("requestSql", reqSql)
                    .subscribe(data => {
                                console.log(data)
                                this.emplacements=data;
                                this.form.patchValue({choixEmplacement:data[0],
                                                      numEmplacement:data[0].emplacement.numero})
                              });
    }
  }
  emplacementSelected(){
    console.log(this.form.value.choixEmplacement);
    this.form.patchValue({numEmplacement:this.form.value.choixEmplacement.emplacement.numero});
    if(this.form.value.choixEmplacement.nbFacture>0){
      alert("Cet emplacement a été facturé et la facture est validée,\n Pas possible de le transférer")
    }
  }

  onSearchRedevable(){
    console.log("onSearchRedevable");
    let reqSql:string="from Redevable ";
    let where="where";
    if(this.form.value.numRedevable!="") where+=` and numredevable=${this.form.value.numRedevable}`;
    if(this.form.value.nomRedevable!="") where+=` and concat(nomRedevable,' ',prenom) like '%${this.form.value.nomRedevable}%'`;
    if(this.form.value.adrRedevable!="") where+=` and concat(numrue,' ',adresse1,' ',adresse2,' ',adresse3) like '%${this.form.value.adrRedevable}%'`;
    if (where.length > 5){
      where = where.replace("and", "");
      reqSql+=where+" order by numRedevable";
      this.httpService.post("requestSql", reqSql)
                    .subscribe(data => {
                                this.redevables=data;
                                this.form.patchValue({choixRedevable:data[0],
                                                      numRedevable:data[0].numRedevable})
                              });
    }
  }
  redevableSelected(){
    console.log(this.form.value.choixRedevable);
    this.form.patchValue({numRedevable:this.form.value.choixRedevable.numRedevable})
  }

  validerTransfert(){
    if(confirm(`Etes-vous sûr de vouloir tranférer l'emplacement N° ${this.form.value.numEmplacement} au redevable N° ${this.form.value.numRedevable}`)){
      this.httpService.post("transfertEmplacement",this.form.value)
      .subscribe(data=>{//type retour dtoRapport
        console.log("Retour transfert emplacement");
        this.form.reset();
        alert("Opération validée avec succès")
      })
    }    
  }

}
