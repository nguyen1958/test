import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-liste-parametre',
  template: `<app-type-parametre *ngFor="let parametre of parametres" 
                  [parametre]="parametre"></app-type-parametre>`,
  styleUrls: ['./liste-parametre.component.css']
})
export class ListeParametreComponent implements OnInit {
  parametres=[
    {
      title:`motif d'annulation`,
      table:'parametre',
      typevaleur:'motifAnnulationfacture',
      isHidden:false
    },
    {
      title:'raison sociale',
      table:'parametre',
      typevaleur:'type_civilite',
      isHidden:true
    },
    {
      title:'profession',
      table:'profession',
      isHidden:true
    },
    {
      title:'banque',
      table:'banque',
      isHidden:true
    }
  ]
  constructor() {}

  ngOnInit() {

  }


}
