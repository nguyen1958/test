import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css']
})
export class ParametresComponent implements OnInit {
  title:string;
  tasks:string[]=["Barème","Marché"];
  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.title=this.route.snapshot.url[0].path;
  }

}
