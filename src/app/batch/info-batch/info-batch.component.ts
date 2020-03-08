import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-info-batch',
  templateUrl: './info-batch.component.html',
  styleUrls: ['./info-batch.component.css']
})
export class InfoBatchComponent implements OnInit {
  @Input()
  batch;
  @Input()
  data;

  constructor(private httpService:HttpService) {}

  ngOnInit() {}

//Visualiser le document
  getUrlDocument(path){
    return encodeURI(`${this.httpService.apiUrl}/showFile?type=rapport&path=${path}`);
  }
//Valider le batch filien
  validerBatchFilien(idBatchFilien){
    if(confirm("Voulez vous valider ce batch,\n il n'est plus possible de saisire de payement pour ces factures ? ")){
      this.httpService.post("validerBatchFilien",idBatchFilien)
          .subscribe(data=>{
              this.data.valide=true;
          });
    }
  }


}
