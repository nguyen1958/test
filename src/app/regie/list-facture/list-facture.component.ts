import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-list-facture',
  templateUrl: './list-facture.component.html',
  styleUrls: ['./list-facture.component.css']
})
export class ListFactureComponent implements OnInit {
  @Input() factures;
  constructor(private httpService:HttpService) { }

  ngOnInit() {
  }

  getEtat(facture){
    return facture.etat=="ANNULEE"?
    "<img src='assets/images/rouge.jpg' height='15px'><p>"+facture.motifAnnulation+"</p>"
    :
    "<img src='assets/images/vert.jpg' height='15px'>";
  }

}
