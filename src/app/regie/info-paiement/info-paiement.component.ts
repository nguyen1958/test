import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Requetes } from '../../models/Requetes';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-info-paiement',
  templateUrl: './info-paiement.component.html',
  styleUrls: ['./info-paiement.component.css']
})
export class InfoPaiementComponent implements OnInit {
  payement;redevable;
  typePayement;banque;
  factures;

  constructor(private httpService:HttpService,
    private router:Router,
    private route:ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
      /**
       * Récupérer le paiement ainsi que les objets associés aux clé étrangères (redevable,typepaiement, banque)
       * et liste des factures assiciées au paiement
       */
      forkJoin(this.httpService.post("requestSql",Requetes.paiementById(params.get("id"))),
               this.httpService.post("requestSql",Requetes.facturesOfPayement(params.get("id"))))
      .subscribe(data=>{
        this.payement=data[0][0].payement;
        this.redevable=data[0][0].redevable;
        this.typePayement=data[0][0].typePayement;
        this.banque=data[0][0].banque;
        this.factures=data[1]
      })
    })
  }

  getContent(){
    
  }

  onAnnuler(){
    let date=new Date().toLocaleString();
    //Impossible annuler si ce n'est pas dans le mois courant
    if(date.substring(3,10)!=this.payement.datePayement.substring(3,10)){
      alert("Impossible d'annuler,\n les états comptables du mois précédents ont été déjà validés ")
      return;
    }
    if(confirm("Etes-vous sûr de vouloir annuler ?")){
      this.httpService.post("annulerPayement",this.payement.id)
      .subscribe(data => {
        //this.router.navigate(['../Info paiement',{id:data.id}],{ relativeTo: this.route })
        this.payement=data;
        console.log("retour valder",data)
      });
    }
    
  }

}
