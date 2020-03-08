import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes';
import { RequestPage } from '../../models/requestPage';

@Component({
  selector: 'app-list-communique',
  templateUrl: './list-communique.component.html',
  styleUrls: ['./list-communique.component.css']
})
export class ListCommuniqueComponent implements OnInit {
  loading=false;
  requestPage:RequestPage;
  communiques=[];
  link1loading=false;link1click=false;link1path;
  link2loading=false;link2click=false;link2path;
  quartiers;secteurs;
  bsConfig={
    containerClass:'theme-green',
    dateInputFormat:'DD/MM/YYYY'
  }

  constructor(private httpService:HttpService) {}

  ngOnInit() {
    window.onscroll=()=>this.detectBottom();
    this.httpService.post("requestSql", Requetes.listeQuartiers).subscribe(data=>this.quartiers=data);
    this.httpService.post("requestSql", Requetes.listevaleursByType('code_secteur'))
        .subscribe(data=>{
          this.secteurs=data.sort((a,b)=>parseInt(a.valeur,10)-parseInt(b.valeur,10))
        })
  };

  loadPage(){
    this.loading=true;
    this.httpService.post("requestPage",this.requestPage)
    .subscribe(data =>{
      if(data.length){
        this.communiques.push(...data);
      }
      else{
        this.requestPage.loadedAll=true;
      }  
      this.loading=false;
    });

  }

  rechercher(form){
    this.communiques=[];
    let anExercice=new Date().getFullYear();
    this.link1click=false;this.link2click=false;
    let requete=`select distinct new map(a as article,e as emplacement,r as redevable) 
    from Article a
    left join ElementFacturation ef on a.idElementFacturation=ef.numero
    left join EmplacementShort e on e.numero=ef.numeroEmplacement
    left join RedevableShort r on r.numRedevable=e.numRedevable
    left join Rue rue on rue.codeVoie=e.codeVoie
    left join BaremeShort b on b.id.code=a.codeBareme`;
    let where=` Where b.id.anExercice=${anExercice}
                and STR_TO_DATE(a.dateProchainControl, '%d/%m/%Y')<=CURDATE()
                and a.etat='FacturerAControler'
                and e.enActivite='enActivite'`;
    if (form.quartier!="") where+=" and e.nomquartier like '"+form.quartier+"%'";
    if (form.secteur!="") where+=" and e.codeSecteur like '"+form.secteur+"%'";
    requete += where;
    requete+=" ORDER BY e.nomquartier,rue.nomrue,e.numrue";
    this.requestPage=new RequestPage(requete);
    this.loadPage();
  }

  getContent(key,data){
    switch(key){
      case "dateControle":
        return data.article && data.article.dateProchainControl.length>0?data.article.dateProchainControl:"-"
    }
  }

  onLink1(form){
    this.link1loading=true;
    this.httpService.post("genererRapport",{codeRapport:'RCO',
                                            quartier:form.quartier,
                                            secteur:form.secteur})
      .subscribe(data=>{
        this.link1path=data.path;
        this.link1click=true;
        this.link1loading=false;
        console.log(data)
      })
  }

  getUrl1(){
    return this.link1path==""?"":encodeURI(`${this.httpService.apiUrl}/showFile?type=rapport&path=${this.link1path}`);
  }

  onLink2(form){
    this.link2loading=true;
    this.httpService.post("genererRapport",{codeRapport:'RCOD',quartier:form.quartier,secteur:form.secteur})
      .subscribe(data=>{
        this.link2path=data.path;
        this.link2click=true;
        this.link2loading=false;
        console.log(data)
      })
  }

  getUrl2(){
    return this.link2path==""?"":encodeURI(`${this.httpService.apiUrl}/showFile?type=rapport&path=${this.link2path}`)
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
