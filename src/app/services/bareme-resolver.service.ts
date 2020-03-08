import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from './data.service';
import { HttpService } from './http.service';
import { Observable, forkJoin } from 'rxjs';
import { Requetes } from '../models/Requetes';

@Injectable({
  providedIn: 'root'
})
export class BaremeResolverService implements Resolve<any[]> {

  constructor(private dataService:DataService,
              private http:HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>{
    return forkJoin(
      this.http.post("requestSql",Requetes.taxes),
      this.http.post("requestSql",Requetes.listevaleursByType('uniteTravail')),
      this.http.post("requestSql",Requetes.listevaleursByType('uniteTemps')),
      this.http.post("requestSql",Requetes.listevaleursByType('typeArrondi'))
    );
  }
 
}
