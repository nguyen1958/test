import { Component, OnInit, OnDestroy, } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Requetes } from '../../models/Requetes';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-info-batch-facture',
  templateUrl: './info-batch-facture.component.html',
  styleUrls: ['./info-batch-facture.component.css']
})
export class InfoBatchFactureComponent implements OnInit,OnDestroy {
  souscriptions=[];
  batch;factures;listefactures;
  constructor(private httpService:HttpService,
    private router:Router,
    private route:ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
      /**
       * Récupérer le batch et les factures
       */
      console.log("idbatch",params.get("idBatch"))
      this.souscriptions.push(
        forkJoin(this.httpService.post("requestSql",Requetes.batchTraitementById(params.get("idBatch"))),
                 this.httpService.post("requestSql",Requetes.facturesByBatch(params.get("idBatch"))))
                 .subscribe(([r1,r2])=>{
                    this.batch=r1[0];
                    this.factures=this.getContent(r2);
                    console.log(this.factures)
                 }))
  
    })
  }  

  ngOnDestroy(): void {
    this.souscriptions.forEach(s=>s.unsubscribe());
  }

  //Retourner la liste des numéros de facture séparés par \n
  getContent(factures){
    return factures.map(data=>{return "Facture numéro : "+data.numeroFacture}).join("\n");
  }
  //l'url est /annee-numeroBatch/BatchNumeroxxxx.pdf
  getUrlFacture(){
    let batch=this.batch;
    return batch?`${this.httpService.apiUrl}/showFile?type=facture&path=${batch.anExercice}-${batch.id}/BatchNumero${batch.id}.pdf`:''
  }
  //l'url est /annee-numeroBatch/BatchNumeroxxxx.pdf
  getUrlRemboursement(){
    let batch=this.batch;
    return batch?`${this.httpService.apiUrl}/showFile?type=remboursement&path=${batch.anExercice}-${batch.id}/BatchNumero${batch.id}.pdf`:''
  }

   //Visualiser le rapport
   getRapport(role){
    let path=role+"_"+this.batch.numeroBatch+".pdf";
    return encodeURI(`${this.httpService.apiUrl}/showFile?type=${role}&path=${path}`);
  }

}
