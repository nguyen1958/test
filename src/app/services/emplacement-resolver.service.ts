import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from './data.service';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Requetes } from '../models/Requetes';

@Injectable({
  providedIn: 'root'
})
export class EmplacementResolverService implements Resolve<any[]> {

  constructor(private dataService:DataService,
              private http:HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>{
    console.log("route.paramMap.get(numero)",route.paramMap.get("numero"));
    return this.http.post("requestSql",Requetes.emplacement(route.paramMap.get("numero")));
  }
 
}
