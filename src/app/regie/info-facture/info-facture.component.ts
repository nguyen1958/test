import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Requetes } from '../../models/Requetes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-info-facture',
  templateUrl: './info-facture.component.html',
  styleUrls: ['./info-facture.component.css']
})
export class InfoFactureComponent implements OnInit,OnDestroy {
  facture;redevable;
  payements=[];souscriptions=[];
  reEditerClicked=false;
  relancerClicked=false;
  listeMotifAnnulation;
  motifAnnulation;
  peutAnnuler;
  loading;
  constructor(private httpService:HttpService,
    private router:Router,
    private route:ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
        this.loadData(params.get("id"))
    });
    //Retourne la liste des motifs d'annalution
    this.souscriptions.push(this.httpService.post("requestSql",Requetes.listevaleursByType("motifAnnulationFacture"))
      .subscribe(data=>{
        this.listeMotifAnnulation=data;
      }))
  }

  ngOnDestroy(): void {
    this.souscriptions.forEach(s=>s.unsubscribe());
  }
 /**
  * Récupérer la facture et redevable
  */  
  loadData(id){
      this.souscriptions.push(this.httpService.post("requestSql",Requetes.factureById(id))
      .subscribe(data=>{
        this.facture=data[0].facture;
        this.redevable=data[0].redevable;
        this.peutAnnuler=data[0].lignePayementCount==0;
        this.motifAnnulation=this.getMotifAnnulation();
      }))
  }
  //Facture normale
  getUrlFacture(){
    let facture=this.facture;
    return facture?`${this.httpService.apiUrl}/showFile?type=facture&path=${facture.anneeEx}-${facture.idBatchTraitement}/${facture.numeroFacture}.pdf`:''
  }
  //facture relance
  getUrlFactureRelance(){
    let facture=this.facture;
    return facture?`${this.httpService.apiUrl}/showFile?type=facture&path=${facture.anneeEx}-${facture.idBatchTraitement}/${facture.numeroFacture}relance.pdf`:''
  }

  getPayements(idFacture){
    this.souscriptions.push(this.httpService.post("requestSql",Requetes.payementsOfFacture(idFacture))
    .subscribe(data=>{
      this.payements=data;
    }));
  }

  reEditerFacture(){
    this.reEditerClicked=false;this.relancerClicked=false;
    if(confirm("Vous désirez re-éditer cette facture ?")){
      this.loading=`<i class="fas fa-spinner fa-spin"></i>`
      this.souscriptions.push(this.httpService.post("reEditerUneFacture",this.facture.idFacture)
      .subscribe(data=>{
        this.loading=""
        this.reEditerClicked=true;
      }))
    }
  }

  relancerFacture(){
    this.reEditerClicked=false;this.relancerClicked=false;
    if(confirm("Vous désirez lancer la relance de cette facture ?")){
      this.loading=`<i class="fas fa-spinner fa-spin"></i>`
      this.souscriptions.push(this.httpService.post("relancerUneFacture",this.facture.idFacture)
      .subscribe(data=>{
        this.loading=""
        this.relancerClicked=true;
      }))
    }
  }

  getMotifAnnulation(){
    let facture=this.facture;
    if(facture.etat.toUpperCase()=='ANNULEE')
      return facture.motifAnnulation
    else
    if (!this.peutAnnuler)
      return "Impossible d'annuler cette facture, il y a des paiements valides associés"
    else
      return null  
  }

  annulerFacture(motif){  
    console.log("annulerFacture",motif)
    if(confirm("Vous désirez annuler cette facture ?")){
      this.souscriptions.push(
        this.httpService.post("annulerUneFacture",{id:this.facture.idFacture,
                                                   motifAnnulation:motif})
        .subscribe(data=>{
          alert("Facture annulée ...")
          this.loadData(this.facture.idFacture)
        }))
    }
  }
}
