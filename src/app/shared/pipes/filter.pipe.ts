import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(source:any, args?: any): any {
    console.log("filter");
    switch(args){
      case "enCours" : return source.filter(x=> x.etat !='ANNULEE' && x.etat != 'preRefacturation' && x.etat != 'preFacturation' && x.solde!=0);
      case "paye" : return source.filter(x=> x.etat != 'ANNULEE' && x.etat != 'preRefacturation' && x.etat != 'preFacturation' && x.solde==0);
      case "annule" : return source.filter(x=> x.etat == 'ANNULEE');
    }
    return null;
  }

}
