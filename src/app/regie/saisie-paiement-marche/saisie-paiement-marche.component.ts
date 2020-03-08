import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from '../../shared/custom.validators';
import { Requetes } from '../../models/Requetes';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-saisie-paiement-marche',
  templateUrl: './saisie-paiement-marche.component.html',
  styleUrls: ['./saisie-paiement-marche.component.css']
})
export class SaisiePaiementMarcheComponent implements OnInit,OnDestroy {

  title;id;
  taxesMarche;typePayements;souscriptions=[];
  form:FormGroup;
  formErrors:{[key:string]:any}={};
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }
  constructor(private fb:FormBuilder,
              private httpService:HttpService,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.form=this.fb.group({
      id:this.fb.control(''),
      etat:this.fb.control(''),
      idTypeTaxe:this.fb.control('',Validators.required),
      numeroQuittance:this.fb.control('',Validators.required),
      datePayement:this.fb.control('',Validators.required),
      idTypePayement:this.fb.control('',Validators.required),
      montantPayement:this.fb.control('',[Validators.required,CustomValidators.decimal]),    
    });
    //Charger les marchés
    this.souscriptions.push(
      forkJoin(
        this.httpService.post("requestSql",Requetes.taxesMarche),
        this.httpService.post("requestSql",Requetes.typePayements))
     .subscribe(([r1,r2])=>{
        this.taxesMarche=r1;
        this.typePayements=r2.filter(obj=>obj.typepayement=='Espece');
        console.log(r2)
      }));
    //Récupérer l'id 
    this.route.paramMap.subscribe(params=>{
        this.id=params.get('id');
        this.initialize()
    })
    //if any field is changed, vérifier erreur du formulaire 
    this.form.valueChanges.subscribe(data=>{
      CustomValidators.detectErrors(this.form,this.formErrors);
    });
  }

  initialize(){
    if(this.id){
      //Modification d'un paiement marché
      this.title=`Modifier un paiement`; 
      //retour un array
      this.souscriptions.push(this.httpService.post("requestSql",Requetes.paiementMarcheById(this.id))
          .subscribe(data=>{
              //On affecte les valeurs du paiement au formulaire
              console.log("initialize",data[0])
              this.form.patchValue(data[0]);
      })) 
    }
    else{
      this.title=`Ajouter un paiement`;
      this.form.reset();  
    }
  }

  ngOnDestroy(): void {
    this.souscriptions.forEach(s=>s.unsubscribe());
  }

  onValider(){
    console.log("valider",this.form.value);
    let action=this.id?"modifier":"ajouter";
    if(confirm(`Voulez-vous ${action} ce paiement ?`)){
      let date=this.form.value.datePayement;
      if(typeof date==='object'){//convertir la date en dd/mm/aaaa
        this.form.value.datePayement=date.toLocaleDateString()
      }
      this.httpService.post("savePayementMarche",this.form.value)
      .subscribe(data => {
        console.log("retour valider",data);    
        this.router.navigate(['.',{id:data.id}],{ relativeTo: this.route }) 
      });
    }
  }

  onSupprimer(){
    console.log("supprimer",this.form.value.id);
    if(confirm("Voulez-vous supprimer ce paiement ?")){
      this.httpService.post("supprimerPayementMarche",this.form.value.id)
      .subscribe(data => {
        //retourner à la recherche des paiements
        this.router.navigate(['../Recherche de paiement'],{ relativeTo: this.route })
      });
    }
  }

}
