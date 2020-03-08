import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../models/user';
import { DataService } from '../services/data.service'
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errLogin:boolean=false;
  constructor(private httpService:HttpService,
              private dataService:DataService,
              private router:Router) { }

  ngOnInit() {
  }
/**
 * Si authentifier ok, on enregistre l'objet user et token dans
 * le session storage pour utiliser dans les prochaines requetes 
 */
  envoyer(form):void{
    this.errLogin=false;
    this.httpService.postAuthentfier("authentifier",{login:form.identifiant,password:form.password})
    .subscribe(data=>{
      if(data.body){
        this.dataService.user=data.body
        this.dataService.token=data.headers.get('AuthToken')
        this.router.navigate(['Accueil']);
      }
      else{
        this.errLogin=true;
      }
    });

  }
}
