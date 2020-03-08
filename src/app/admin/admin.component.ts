import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  title:string;
  tasks:string[]=["Type de taxe","Rue","Paramètre","Utilisateur",
                  "Historique des tâches","Outil","Idoss",
                  "Modèles des courriers","Groupement des taxes"];
                  
  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.title=this.route.snapshot.url[0].path;
  }

}
