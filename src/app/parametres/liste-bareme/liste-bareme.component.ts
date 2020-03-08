import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-liste-bareme',
  templateUrl: './liste-bareme.component.html',
  styleUrls: ['./liste-bareme.component.css']
})
export class ListeBaremeComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  baremes=[];
  taxes;

  constructor(private httpService:HttpService,
              private dataService: DataService) {}

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    this.httpService.post("requestSql", Requetes.taxes)
                          .subscribe(data=>this.taxes=data);
    let requete=this.dataService.requete_list_baremes?this.dataService.requete_list_baremes:Requetes.listeBaremes;
    this.requestPage=new RequestPage(requete)
    this.loadPage();
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        this.baremes.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });
  }

  rechercher(form){
    this.baremes=[];
    let reqSql=Requetes.listeBaremes;    
    let where=" Where";
    if (form.annee != "") where += " and b.id.anExercice='" + form.annee+"'";
    if (form.codeBareme != "") where += " and b.id.code like '" + form.codeBareme + "%'";
    if (form.libelle != "") where += " and b.libelle like '%" + form.libelle + "%'";
    if (form.taxe != "") where += " and b.idImputation="+form.taxe;
    where = where.replace("and", "");
    if (where.length > 6) reqSql += where;
    this.dataService.requete_list_baremes=reqSql;
    this.requestPage=new RequestPage(reqSql)
    this.loadPage();
  }

  detectBottom(): void {
    if(this.requestPage){
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!this.requestPage.loadedAll) {
          this.requestPage.paginate();
          this.loadPage();
        }
      }
    }   
  }  

}
