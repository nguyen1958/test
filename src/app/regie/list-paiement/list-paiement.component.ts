import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-paiement',
  templateUrl: './list-paiement.component.html',
  styleUrls: ['./list-paiement.component.css']
})
export class ListPaiementComponent implements OnInit {
  @Input() payements;
  constructor() { }

  ngOnInit() {
  }

}
