import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-type-parametre',
  templateUrl: './type-parametre.component.html',
  styleUrls: ['./type-parametre.component.css']
})
export class TypeParametreComponent implements OnInit {
  @Input() parametre:any;
 
  listeValeurs;
  valeurModifier;
  valeurAjouter;

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    this.valeurModifier={
      table:this.parametre.table,
      typevaleur:this.parametre.typevaleur,
      id:null,
      valeur:null
    };
    this.valeurAjouter={...this.valeurModifier};
    this.chargerValeur();
    console.log(this.valeurAjouter,this.valeurModifier)
  }

  chargerValeur(){
    switch (this.parametre.table){
      case 'parametre':
        this.httpService.post("requestSql", Requetes.listevaleursByType(this.parametre.typevaleur))
        .pipe(map(array=>array.map(objet=>{return{id:objet.id,valeur:objet.valeur}})
        ))
        .subscribe(data=>{
          this.listeValeurs=data
        });      
        break;
      case 'profession' :
        this.httpService.post("requestSql", Requetes.professions)
        .pipe(map(array=>array.map(objet=>{return{id:objet.code,valeur:objet.libelle}})
        ))
        .subscribe(data=>{
          this.listeValeurs=data
        });      
        break;
      case 'banque' :
        this.httpService.post("requestSql", Requetes.banques)
        .pipe(map(array=>array.map(objet=>{return{id:objet.id,valeur:objet.libelle}})
        ))
        .subscribe(data=>{
          this.listeValeurs=data
        });      
        break;
    }
  }

  onSelection(event){//Récupère id et valeur
    if(event.length==1){
      this.valeurModifier.id=event[0].id;
      this.valeurModifier.valeur=event[0].valeur;
    }
    else{
      this.valeurModifier.valeur=null;
    }
   
  }

  modifier(){
    console.log("modifier",this.valeurModifier);
    this.httpService.post("saveParametre",this.valeurModifier)
      .subscribe(data => {
        console.log("retour valider");
        this.chargerValeur();
        this.valeurModifier.valeur=null;
    });
  }

  supprimer(){
    console.log("supprimer",this.valeurModifier);
    this.httpService.post("deleteParametre",this.valeurModifier)
      .subscribe(data => {
        console.log("retour supprimer");
        this.chargerValeur();
        this.valeurModifier.valeur=null;
    });
  }

  ajouter(){
    console.log("ajouter",this.valeurAjouter);
    this.httpService.post("saveParametre",this.valeurAjouter)
      .subscribe(data => {
        console.log("retour valider");
        this.chargerValeur();
        this.valeurAjouter.valeur=null;
    });
  }


}
