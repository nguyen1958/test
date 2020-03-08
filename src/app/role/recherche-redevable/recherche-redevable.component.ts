import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Requetes } from '../../models/Requetes'
import { Subscription, Observable, forkJoin } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
/*
import { Profession } from '../../models/Profession';
import { Imputation } from '../../models/Imputation';
import { Bareme } from '../../models/bareme';
*/
@Component({
  selector: 'app-recherche-redevable',
  templateUrl: './recherche-redevable.component.html',
  styleUrls: ['./recherche-redevable.component.css']
})
export class RechercheRedevableComponent implements OnInit, OnDestroy {
  professions = []; etats = []; taxes = []; secteurs = []; baremes = [];
  quartiers = []; souscriptions= [];
  message = "";
  loading=false;
  buffer = {
    numredevable: '',
    actif: '',
    nomredevable: '',
    nomcommercial: '',
    numemplacement: '',
    etat: '',
    quartier: '',
    secteur: '',
    numrue: '',
    nomrue: '',
    taxe: '',
    bareme: '',
    profession: ''
  }
  constructor(private httpService: HttpService,
              private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    //Permet de lancer plusieurs observables à la fois en parallèle
    this.souscriptions.push(
      forkJoin(this.httpService.post("requestSql", Requetes.listevaleursByType('etat_emplacement')),
      this.httpService.post("requestSql", Requetes.listevaleursByType('code_secteur')),
      this.httpService.post("requestSql", Requetes.quartiers),
      this.httpService.post("requestSql", Requetes.professions),
      this.httpService.post("requestSql", Requetes.taxes),
      this.httpService.post("requestSql", Requetes.baremes))
      .subscribe(([r1, r2, r3, r4, r5, r6]) => {
        this.etats = r1;
        this.secteurs = r2;
        this.quartiers = r3;
        this.professions = r4;
        this.taxes = r5;
        this.baremes = r6;
      })
    );
  }

  get diagnostic() {
    return JSON.stringify(this.buffer);
  }

  ngOnDestroy() {
    console.log(this.souscriptions.length);
    this.souscriptions.forEach(s=>s.unsubscribe());
  }

  onSubmit() {
    console.log("buffer\n",this.buffer)
    //Requete obtenant le nbre d'enregistrement trouvé
    let reqSql = "select count(distinct r) from Redevable r " +
      "left join Emplacement e on e.numRedevable=r.numRedevable " +
      "left join ImputationShort i on i.id.idImputation=e.codeType and e.anneeExerciceImputation=i.id.anneeExercice ";
    let where = " where r.numRedevable<>-1 ";
    let orderBy = " Order by r.nomRedevable";
    if (this.buffer.numredevable != "") where += " and r.numRedevable=" + Number(this.buffer.numredevable);
    if (this.buffer.actif != "") where += " and r.actif='" + this.buffer.actif + "'";
    if (this.buffer.nomredevable != "") where += " and concat(r.nomRedevable,' ',r.prenom) like '%" + this.buffer.nomredevable + "%'";
    if (this.buffer.nomcommercial != "") where += " and e.raisonSocial like '%" + this.buffer.nomcommercial + "%'";
    if (this.buffer.profession != "") where += " and r.numeroProfession=" + this.buffer.profession;
    if (this.buffer.numemplacement != "") where += " and e.numeroEmplacementPersonalise=" + this.buffer.numemplacement;
    if (this.buffer.etat != "") where += " and e.enActivite='" + this.buffer.etat + "'";
    if (this.buffer.quartier != "") where += " and e.nomquartier='" + this.buffer.quartier + "'";
    if (this.buffer.secteur != "") where += " and e.codeSecteur='" + this.buffer.secteur + "'";
    if (this.buffer.numrue != "") where += " and e.numrue='" + this.buffer.numrue + "'";
    if (this.buffer.nomrue != "") where += " and e.adresse1 like '%" + this.buffer.nomrue + "%'";
    if (this.buffer.taxe != "") where += " and e.codeType='" + this.buffer.taxe + "'";
    if (this.buffer.bareme != "") {
      reqSql += "join ElementFacturation ef on ef.numeroEmplacement=e.numero " +
        "join Article a on a.idElementFacturation=ef.numero " +
        "join Bareme b on b.code=a.codeBareme ";
      where += " and b.code='" + this.buffer.bareme + "'";
    }
    //where = where.replace("and", "");
    //On ajoute clause where si y a condition
    //if (where.length > 7) reqSql += where;
    reqSql += where;
    console.log(where, reqSql);
    this.souscriptions.push(this.httpService.post("requestSql", reqSql)
      .subscribe(data => {
        if (data[0] == 0) {
          this.message = "Aucune donnée sélectionnée pour ces critères ...";
        }
        else if (data[0] > 300) {
          this.message = "Il y a plus de 300 resultats veuillez remplir un ou plusieurs champs de filtre de recherche pour obtenir les informations détaillées.";
        }
        else {//Changer nombre trouvé par les données à sélectionner
          this.loading=true;
          reqSql = reqSql.replace("count(distinct r)", "distinct new map(e as emplacement,r as redevable, i as taxe)");
          reqSql += orderBy
          this.souscriptions.push(this.httpService.post("requestSql", reqSql)
            .subscribe(data => {
              //Sauvegarder la requete et naviguer à la liste des redevables
              this.dataService.requete_redevables=reqSql;
              this.router.navigate(['Rôle/Liste des redevables']);
            }));
        };
      }));
  }

}


