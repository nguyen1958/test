import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-historique-batch',
  templateUrl: './historique-batch.component.html',
  styleUrls: ['./historique-batch.component.css']
})
export class HistoriqueBatchComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  taxes;
  historiqueBatchs=[];
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    this.httpService.post("requestSql",Requetes.taxes)
      .subscribe(data=>this.taxes=data)
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        this.historiqueBatchs.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });

  }

  rechercher(form){
    this.historiqueBatchs=[];
    let requete=`select o from BatchTraitement o `;
    let where=" Where (etape='facturation' OR etape='preFacturation') ";
    let date=form.date?form.date.toLocaleDateString():"";
    if (date != "") where += " and o.dateExecution like '" + date +"%'";
    if (form.taxe != "") where += " and o.typeEmplacement = '" + form.taxe+"'";
    if (form.acfacture=='true') where += " and o.nombreDeFactureCree > 0";
    if (form.acfacture=='false') where += " and o.nombreDeFactureCree = 0";
    if (form.acrapport=='true') where += " and o.aEditeeDesFacturesAnnulee = 'true'";
    if (form.acrapport=='false') where += " and o.aEditeeDesFacturesAnnulee = 'false'";
    if (form.etat != "") where += " and o.valide = '" + form.etat+"'";
    console.log("date=",date)
    requete+=where + " ORDER BY o.id DESC"
    this.requestPage=new RequestPage(requete)
    this.loadPage();
  }

  detectBottom(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (!this.requestPage.loadedAll) {
        this.requestPage.paginate();
        this.loadPage();
      }
    }
  }  

}
