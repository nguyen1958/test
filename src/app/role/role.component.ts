import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  title:string;
  tasks:string[]=["Recherche d'un redevable","Création d'un redevable","Alerte"];
  constructor(private route:ActivatedRoute) {}

  ngOnInit() {
    this.title=this.route.snapshot.url[0].path;
  }

}
