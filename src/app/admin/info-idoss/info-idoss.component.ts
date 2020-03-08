import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Requetes } from '../../models/Requetes';

@Component({
  selector: 'app-info-idoss',
  templateUrl: './info-idoss.component.html',
  styleUrls: ['./info-idoss.component.css']
})
export class InfoIdossComponent implements OnInit {
  numeroBatch;dateLancement;
  ligneValide=[];ligneNonValide=[];ligneNonReconnu=[];
  constructor(private httpService:HttpService,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
      this.numeroBatch=params.get('id');
      this.dateLancement=params.get('date');
      this.initialize();
    });
  }

  initialize(){
    console.log(this.numeroBatch,this.dateLancement)
    forkJoin(
      this.httpService.post("requestSql",Requetes.rapprochementIdoss(this.numeroBatch,"valide")),
      this.httpService.post("requestSql",Requetes.rapprochementIdoss(this.numeroBatch,"nonValide")),
      this.httpService.post("requestSql",Requetes.rapprochementIdoss(this.numeroBatch,"nonReconnu"))
    ).subscribe(data=>{
      this.ligneValide=data[0],
      this.ligneNonValide=data[1],
      this.ligneNonReconnu=data[2]
    });   
  }

}
