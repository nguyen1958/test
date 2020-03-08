import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from '../../shared/custom.validators';
import { forkJoin } from 'rxjs';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-nouvelle-reclamation',
  templateUrl: './nouvelle-reclamation.component.html',
  styleUrls: ['./nouvelle-reclamation.component.css']
})
export class NouvelleReclamationComponent implements OnInit,OnDestroy {
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  typeReceptions=[];natureReclamations=[];
  title="Ajouter un réclamation"
  facture;redevable;
  souscriptions= [];
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }
  constructor(private fb:FormBuilder,
              private httpService:HttpService,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.souscriptions.push(
      forkJoin(this.httpService.post("requestSql", Requetes.listevaleursByType('typeReceptionReclamation')),
      this.httpService.post("requestSql", Requetes.listevaleursByType('motifAnnulationFacture')))
      .subscribe(([r1, r2]) => {
        this.typeReceptions = r1;
        this.natureReclamations = r2;
      })
    );
    this.formInitialize();
  }

  ngOnDestroy() {
    console.log(this.souscriptions.length);
    this.souscriptions.forEach(s=>s.unsubscribe());
  }

  formInitialize(){
    this.form=this.fb.group({
      idFacture:this.fb.control(''),
      numeroFacture:this.fb.control('',Validators.required),
      numeroTitre:this.fb.control(''),
      anneeTitre:this.fb.control(''),
      dateReclamation:this.fb.control(new Date().toLocaleDateString(),Validators.required),
      typeTaxe:this.fb.control(''),
      typeReception:this.fb.control('',Validators.required),
      idClient:this.fb.control('',Validators.required),
      natureReclamation:this.fb.control('',Validators.required),
      textReclamation:this.fb.control('',Validators.required),
      etat:this.fb.control('ENCOURS'),
      controleEffectue:this.fb.control('NON'),
      articles:this.fb.array([])
    });
    //if any field is changed, vérifier erreur du formulaire 
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
      console.log("valueChange")
    });
  }

  rechercher(critere){
    let condition="";
    //dupliquer valeur du formulaire
    let form={...this.form.value}
    //Réinitiliser le formulaire
    this.formInitialize();
    switch(critere){
        case "numero":condition=`f.numeroFacture='${form.numeroFacture}'`;break;
        case "titreAnnee":condition=`f.numeroTitre='${form.numeroTitre}' 
                                      and f.anneeTitre='${form.anneeTitre}'`;break;
    }
    console.log("condition",condition)
    let sql=`select new map(f as facture,r as redevable) 
            from Facture f
            join RedevableShort r on r.numRedevable=f.idClient 
            where ${condition} order by f.idFacture desc`;

    this.souscriptions.push(
        this.httpService.post("requestPage",new RequestPage(sql,1))
          .subscribe(data=>{
              if(data.length){
                this.facture=data[0].facture;
                this.redevable=data[0].redevable;
                this.form.patchValue(this.facture)
                console.log("facture\n",this.facture)
                this.getArticles(this.facture.numeroFacture)
                console.log("form",form)
              }
              else{
                alert('Facture non trouvée ...')
              }
          })
        )      
  }

  getArticles(numFacture){
    let sql=`select new map(a as article,b as bareme)
              from Article a
              join LigneFacture lf on a.idArticle=lf.idArticle
              join Facture f on lf.idFacture=f.numeroFacture
              join BaremeShort b on a.codeBareme=b.id.code
              where b.id.anExercice=a.anExercice
              and f.numeroFacture=${numFacture}`;
    this.souscriptions.push(
      this.httpService.post("requestSql",sql)
      .subscribe(data=>{
        data.map(data=>{
          (<FormArray>this.form.get("articles")).push(
            this.fb.group({
              selected:false,
              idArticle:data.article.idArticle,
              libelle:`${data.article.idArticle}: ${data.article.nom.startsWith("#")?"-":data.article.nom} ---- ${data.bareme.libelle}`
            })
          )
        })
        console.log("data",data)
      }))
  }

  onValider(){
    console.log("valider",this.form.value);
    //forcer la valeur
    this.form.value.etat='ENCOURS';
    this.httpService.post("addReclamation",this.form.value)
    .subscribe(data => {
      console.log("retour valider",data);    
      this.router.navigate(['../Modification reclamation',{id:data}],{ relativeTo: this.route }) 
    });
  }

  onTest(){
    //this.formInitialize();
    this.form.value.etat='ENCOURS';
    console.log("Test",this.form.value);
    //this.router.navigate(['../Modification reclamation',{id:1}],{ relativeTo: this.route }) 
  }

   getUrlFacture(){
    let facture=this.facture;
    return facture?`${this.httpService.apiUrl}/showFile?type=facture&path=${facture.anneeEx}-${facture.idBatchTraitement}/${facture.numeroFacture}.pdf`:''
  }

}
