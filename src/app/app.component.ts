import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { Router} from '@angular/router';
import { of, range } from 'rxjs';
import { tap, map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project1';
  menus:string[]=["Accueil","Contrôle","Paramètres","Régie","Rôle","Admin","Batch"];
  menuSelected:string;
  
  //trace navigation router
  constructor(public dataService:DataService,
              private router:Router){};
              
  ngOnInit(){
    //this.router.navigate([this.menus[0]]);
  }
 
  logout(){
    this.dataService.user=null;
    this.dataService.token=null;
    this.router.navigate(['/']);
  }

  /*Pour test*/

  onTest(){
    const myObservable = of("foobar","ok");
    myObservable.pipe(
        tap((value) => console.log('Avant : ' + value)),
        map((value: string) => value.length),
        tap((value) => console.log('Après : ' + value)),
    ).subscribe((value: number) => {
        console.log(value);  // 6
    });
   
 /*
   let array1=Array(500);
   console.log(array1.fill(0, 0));
   let array2=array1.slice(0,array1.length-1);
   console.log(array2);
*/

  }
  
}
