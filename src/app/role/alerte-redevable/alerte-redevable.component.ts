import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Subscription, forkJoin } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-alerte-redevable',
  templateUrl: './alerte-redevable.component.html',
  styleUrls: ['./alerte-redevable.component.css']
})
export class AlerteRedevableComponent implements OnInit,OnDestroy {
  loading=false;
  taxes=[];secteurs=[];controleurs=[];
  souscriptions:Subscription[]=[];
  emplacementsLibre=[];
  emplacementsAModifier=[];
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY',
  }
  buffer={
    secteur:'',
    numrue:'',
    nomrue:'',
    taxe:'',
    dateControle:'',
    controleur:'',
    dateControl:'',
  }
  constructor(private httpService:HttpService,
              private route:ActivatedRoute,    
              private router:Router) {}

  ngOnInit() {
    //Permet de lancer plusieurs observables à la fois en parallèle
    this.souscriptions.push(
      forkJoin(this.httpService.post("requestSql",Requetes.listevaleursByType('code_secteur')),
             this.httpService.post("requestSql",Requetes.taxes),
             this.httpService.post("requestSql",Requetes.controleurs))
             .subscribe(([r1,r2,r3])=>{
                this.secteurs=r1.sort((a,b)=>{
                  if(parseInt(a.valeur,10)<parseInt(b.valeur,10)) return -1
                  if(parseInt(a.valeur,10)==parseInt(b.valeur,10)) return 0
                  if(parseInt(a.valeur,10)>parseInt(b.valeur,10)) return 1
                });
                this.taxes=r2; 
                this.controleurs=r3;             
             })
    );
    this.rechercher();
  }

  rechercher(){
    this.loading=true;
    let reqEmpLibre="select distinct new map(e as emplacement,r as redevable,"+ 
                    "i as taxe, hce as historique) from Emplacement e "+
    "left join ImputationShort i on i.id.idImputation=e.codeType and e.anneeExerciceImputation=i.id.anneeExercice "+
    "left join Redevable r on e.numRedevable=r.numRedevable "+
    "left join HistoriqueControlEmplacement hce on e.numero=hce.idEmplacement ";
    let where=" where e.numRedevable=-1";
    let orderBy=" Order by date"; 
    if(this.buffer.secteur!="")        where+=" and e.codeSecteur='"+this.buffer.secteur+"'";
    if(this.buffer.numrue!="")         where+=" and e.numrue='"+this.buffer.numrue+"'";
    if(this.buffer.nomrue!="")         where+=" and e.adresse1 like '%"+this.buffer.nomrue+"%'";
    if(this.buffer.taxe!="")           where+=" and e.codeType='"+this.buffer.taxe+"'";
    if(this.buffer.controleur!="")     where+=" and hce.idControleur="+this.buffer.controleur;
    if(this.buffer.dateControle!="")    where+=" and hce.dateControle'"+this.buffer.dateControle+"'";
    reqEmpLibre+=where;
    //Il s'agit de la même requête sauf à changer la clause where
    let reqEmpAModifier=reqEmpLibre.replace("e.numRedevable=-1","e.enActivite='aModifier'");
    //Trier tableau car il est impossible de trier dans requete jpql pour cause dateControle n'est pas type date
    //Fonction conversion date inexitante dans jpql
    this.souscriptions.push(
      forkJoin(this.httpService.post("requestSql",reqEmpLibre),
             this.httpService.post("requestSql",reqEmpAModifier))
             .subscribe(([r1,r2])=>{
                this.emplacementsLibre=r1.sort(this.compareDateDesc);
                this.emplacementsAModifier=r2.sort(this.compareDateDesc);
                this.loading=false;
             })
    ); 
  }
  //Convertir les dates (string) en dates et les compare
  compareDateDesc(d1,d2){
    let el=d1.historique.dateControle.split("/");
    let date1=new Date(el.reverse().join("-"));
    el=d2.historique.dateControle.split("/");
    let date2=new Date(el.reverse().join("-"));
    return (date1<date2)?1:(date1>date2)?-1:0;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.souscriptions.forEach(s=>s.unsubscribe());
  }


}
