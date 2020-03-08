import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {
  title:string;
  tasks:string[]=["Batch traitement","Batch rapport comptable","Traitements divers",
                  "Historique des batchs","Refacturation","Rapports"];
  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.title=this.route.snapshot.url[0].path;
  }

}
