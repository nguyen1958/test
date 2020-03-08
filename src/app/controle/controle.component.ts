import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-controle',
  templateUrl: './controle.component.html',
  styleUrls: ['./controle.component.css']
})
export class ControleComponent implements OnInit {
  title:string;
  tasks:string[]=["Alerte",
                  `Réclamation`,
                  "Liste des communiqués",
                  "Rupture des contrôles",
                  "Historique synchronisation",
                  "Historique des contrôles",
                ];
  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.title=this.route.snapshot.url[0].path;
  }

}
