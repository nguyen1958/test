import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from './data.service';
import { HttpService } from './http.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListRedevablesResolverService implements Resolve<any[]> {

  constructor(private dataService:DataService,
              private http:HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> | any{
    console.log(this.dataService.requete_redevables);
    //return observable de [] si requete_redevables est null
    return this.dataService.requete_redevables?this.http.post("requestSql",this.dataService.requete_redevables) : of([])
  }
 
}
