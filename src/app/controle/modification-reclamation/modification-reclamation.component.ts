import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Requetes } from '../../models/Requetes';
import { CustomValidators } from '../../shared/custom.validators';
import { RequestPage } from '../../models/requestPage';


@Component({
  selector: 'app-modification-reclamation',
  templateUrl: './modification-reclamation.component.html',
  styleUrls: ['./modification-reclamation.component.css']
})
export class ModificationReclamationComponent implements OnInit {
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  typeReceptions=[];natureReclamations=[];controleurs=[];
  modeleCourriers=[];courrierReponses=[];
  title="Modification de la réclamation"
  facture;redevable;reclamation
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
    this.formInitialize();
    this.souscriptions.push(
      forkJoin(this.httpService.post("requestSql", Requetes.listevaleursByType('typeReceptionReclamation')),
      this.httpService.post("requestSql", Requetes.listevaleursByType('motifAnnulationFacture')),
      this.httpService.post("requestSql", Requetes.controleurs),
      this.httpService.post("requestSql", Requetes.modeleCourriers))
      .subscribe(([r1, r2,r3,r4]) => {
        this.typeReceptions = r1;
        this.natureReclamations = r2;
        this.controleurs=r3;
        this.modeleCourriers=r4;
        //initialiser le premier modele
        this.form.patchValue({modele:r4.length>0?r4[0]:null})
      })
    );
    
  }

  ngOnDestroy() {
    console.log(this.souscriptions.length);
    this.souscriptions.forEach(s=>s.unsubscribe());
  }

  formInitialize(){
    console.log("formInitialize")
    this.form=this.fb.group({
      id:this.fb.control(''),
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
      controleEffectue:this.fb.control('',Validators.required),
      dateControle:this.fb.control(''),
      dateReponse:this.fb.control(''),
      idAgentControl:this.fb.control(null),
      reponseReclamation:this.fb.control(''),
      etat:this.fb.control('',Validators.required),
      modele:this.fb.control('',Validators.required),
      lienCourrier:this.fb.control(''),
      articles:this.fb.array([])
    });
    //Obtenir id de la réclamation
    this.route.paramMap.subscribe(params=>{
      let id=params.get('id');
      let sql=`select new map(f as facture,r as redevable,rc as reclamation) 
            from Reclamation rc
            join Facture f on rc.idFacture=f.numeroFacture
            join RedevableShort r on rc.idRedevable=r.numRedevable 
            where rc.id=${id}`;
      if(id){
        this.souscriptions.push(
          this.httpService.post("requestSql",sql)
            .subscribe(data=>{
                if(data.length){
                  this.facture=data[0].facture;
                  this.redevable=data[0].redevable;
                  this.reclamation=data[0].reclamation;
                  this.form.patchValue(this.facture);
                  this.form.patchValue(this.reclamation);
                  this.getCourrierReponses(id)
                  this.getArticles(id)
                  console.log(this.reclamation)
                }
                else{
                  alert('Réclamation non trouvée ...')
                }
            })
          )      
      }
    })
    //if any field is changed, vérifier erreur du formulaire 
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
      console.log("valueChange")
    });
  }

  getCourrierReponses(idReclamation){
    let sql=`select new map(hc.courrier as lien,
                            concat('Un courier est cree le ',hc.dateCreation,' avec le modèle ',mc.nomModele) as libelle)
              from HistoriqueCourrier hc
              join ModeleCourrier mc on hc.idModele=mc.id
              where hc.idReclamation=${idReclamation} order by hc.id DESC`;
    this.souscriptions.push(
      this.httpService.post("requestSql",sql)
      .subscribe(data=>{
          this.courrierReponses=data;
      }))
    
  }
  
  getArticles(idReclamation){
    let sql=`select new map(a as article,b as bareme)
              from ReclamationArticle ra
              join Article a on a.idArticle=ra.idArticle
              join BaremeShort b on a.codeBareme=b.id.code and b.id.anExercice=a.anExercice
              where ra.idReclamation=${idReclamation}`;
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
      }))
  }

  onValider(){
    console.log("valider",this.form.value);
    let {dateControle,dateReponse}=this.form.value;
    if(typeof dateControle==='object'){
      this.form.value.dateControle=dateControle?dateControle.toLocaleDateString():''
    }
    if(typeof dateReponse==='object'){
      this.form.value.dateReponse=dateReponse?dateReponse.toLocaleDateString():''
    }
    this.httpService.post("updateReclamation",this.form.value)
    .subscribe(data => {
      console.log("retour valider",data);    
      //this.router.navigate(['.',{id:data.id.code,annee:data.id.anExercice}],{ relativeTo: this.route }) 
    });
  }

  onSupprimer(){
    //this.formInitialize();
    console.log("onSupprimer",this.form.value);
    this.httpService.post("deleteReclamation",this.form.value.id)
    .subscribe(data => {
      console.log("retour onSupprimer",data);    
      this.router.navigate(['../Réclamation'],{ relativeTo: this.route }) 
    });
  }

  getUrlFacture(){
    let facture=this.facture;
    return facture?`${this.httpService.apiUrl}/showFile?type=facture&path=${facture.anneeEx}-${facture.idBatchTraitement}/${facture.numeroFacture}.pdf`:''
  }

  getUrlCourrier(lien){
    return `${this.httpService.apiUrl}/showFile?type=courrier&path=${lien}`
  }

  genererCourrier(){
    this.httpService.post("genererCourrierReclamation",{id:this.form.value.id,idModele:this.form.value.modele.id},{responseType:"text"})
    .subscribe(data => {
      this.form.value.lienCourrier=data;
      this.getCourrierReponses(this.form.value.id)
    });
  }
}
