import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-regie',
  templateUrl: './regie.component.html',
  styleUrls: ['./regie.component.css']
})
export class RegieComponent implements OnInit {

  title:string;
  tasks:string[]=["Recherche de paiement","Recherche de facture","Saisie de paiement marché"];
  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.title=this.route.snapshot.url[0].path;
  }

}
