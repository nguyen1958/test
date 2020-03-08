import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-rupture-controle',
  templateUrl: './rupture-controle.component.html',
  styleUrls: ['./rupture-controle.component.css']
})
export class RuptureControleComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  quartiers;
  ruptures=[];
  anneeCourante=new Date().getFullYear();
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    this.httpService.post("requestSql", Requetes.listeQuartiers).subscribe(data=>this.quartiers=data);
  }

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        let temp=data.filter(data=>{
          data.article.numeroPeriodeActuelle=this.calculPeriode(data);
          let diff=data.article.numeroPeriodeActuelle-parseInt(data.article.dernierePeriodeFacture);    
          return diff>1;
        });
        this.ruptures.push(...temp);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });

  }

  rechercher(form){
    this.ruptures=[];
    let requete=`select distinct new map(a as article,e as emplacement,b as bareme) 
    from Article a
    left join ElementFacturation ef on ef.numero=a.idElementFacturation
    left join EmplacementShort e on ef.numeroEmplacement=e.numero
    left join Rue r on r.codeVoie=e.codeVoie
    left join BaremeShort b on b.id.code=a.codeBareme 
    left join ImputationShort i on i.id.idImputation=b.idImputation
    `;
    let where=` Where (a.etat='FacturerAControler' or a.etat='ControlerAFacturer')
                and b.id.anExercice=${this.anneeCourante}`;
    if (form.quartier!="") where+=" and r.nomquartier='"+form.quartier+"'";
    requete+=where;
    requete+=" ORDER BY r.nomquartier,r.nomrue,e.numrue";
    this.requestPage=new RequestPage(requete);
    this.loadPage();
  }

  getContent(type){
    switch(type){
      case "ST":return "Synchronisation totale";  
      case "SP":return "Synchronisation partielle"; 
      default:return "-";
    }
  }

  calculPeriode(data){
    let type=data.bareme.dureeUnitaire;
    let dateSplit=data.article.dateDebutAutorisation.split("/");
    let dateDebut= new Date(dateSplit[2],dateSplit[1]-1,dateSplit[0],1);
    let dateFin=new Date();
    let timeDiff = Math.abs(dateFin.getTime() - dateDebut.getTime());
    switch(type.toLowerCase()){
      case "jour": return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      case "semaine":return Math.ceil(timeDiff / (1000 * 3600 * 24 * 7));
      case "mois": return (dateFin.getFullYear()-dateDebut.getFullYear()) * 12 + (dateFin.getMonth() - dateDebut.getMonth());
      case "trimestre":
            let months=(dateFin.getFullYear()-dateDebut.getFullYear()) * 12 + (dateFin.getMonth() - dateDebut.getMonth());
            return months%3==0?months/3:(months/3)+1;
      case "an": return dateFin.getFullYear()-dateDebut.getFullYear()+1;
      default: return 1;
    }
  }

  onCheck(event,index){
    let idArticle=this.ruptures[index].article.idArticle;
    let sql=`update Article set etat='NePlusFacturer' where idArticle=${idArticle}`;
     if (confirm(`Voulez-vous arrêter la facturation de l'ouvrage numero ${idArticle} ?`)){
        this.httpService.post("updateQuery",sql)
          .subscribe(data=>{
            this.ruptures.splice(index,1);
          })
     }
     else{
       event.currentTarget.checked=false;
     }
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
