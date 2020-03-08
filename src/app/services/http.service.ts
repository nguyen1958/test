import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { environment } from '../../environments/environment'
import { DataService } from './data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  //Voir proxy in proxy.conf.json (only for developpment): 
  //redirection vers server distant endpoint localhost:4200
  //parameter present in environment.ts
  //baseUrl:string="http://localhost:4200/r2tv3"; for developpment
  //parameter present in environment.prod.ts
  //baseUrl:string="http://46.105.97.78:90/r2trs"; for production

  baseUrl;
  constructor(private http:HttpClient,
              private dataService:DataService,
              private router:Router) {
    this.baseUrl=environment.apiUrl;
    console.log("apiUrl",this.baseUrl)
  }

  get apiUrl(){
    return this.baseUrl;
  }

  get sizePerPage(){
    return 100;
  }

  get(uri:string,options?:{}):Observable<any>{
    return this.http.get(`${this.baseUrl}/${uri}`,
                          {headers:{'AuthToken':this.dataService.token}})
                .pipe(catchError(this.handlerError.bind(this)));
  }
//retourner objet body
  post(uri:string,data?:any,options?:{}):Observable<any>{
    return this.http.post(`${this.baseUrl}/${uri}`,data,
                          {...options,headers:{'AuthToken':this.dataService.token}})
                .pipe(catchError(this.handlerError.bind(this)));
  }
//retourner objet httpResponse
  postAuthentfier(uri:string,data?:any,options?:{}):Observable<any>{
    return this.http.post(`${this.baseUrl}/${uri}`,data,
                          {...options,observe:'response'})
                .pipe(catchError(this.handlerError.bind(this)));
  }

  handlerError(errorResponse:HttpErrorResponse){
  
    if (errorResponse.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      window.alert(`Erreur côté client :\n\n${errorResponse.error.message}`)
    } else {
      console.log("errorResponse",errorResponse)
      // The backend returned an unsuccessful response code.
      // objet error retourné du côté serveur (exceptionResponse)
      //status 401 = token is not valid
      if(errorResponse.error.status==401){
        this.dataService.user=null;
        this.dataService.token=null;
        this.router.navigate(['/']);
        window.alert(`Erreur côté seveur :\n\n${errorResponse.error.message}`)
      }
      else{
        window.alert(`Erreur côté seveur :\n\n${errorResponse.error.type}\n${errorResponse.error.message}`)
      }
    }  
    // return an observable with a user-facing error message
    return throwError(errorResponse || "Erreur provenant du serveur !!!");
  }

}
