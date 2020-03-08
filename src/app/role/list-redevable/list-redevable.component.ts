import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-redevable',
  templateUrl: './list-redevable.component.html',
  styleUrls: ['./list-redevable.component.css']
})
export class ListRedevableComponent implements OnInit {
  redevables=[];
  constructor(private route:ActivatedRoute) {}

  //Liste des redevables est fournie par Resolver route service
  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.redevables=data.redevables;
    });
  }

}
