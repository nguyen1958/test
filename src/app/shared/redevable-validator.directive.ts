import { Directive,Input } from '@angular/core';
import { Validator,AbstractControl, NG_VALIDATORS, FormControl, NgForm } from '@angular/forms';
import { PARAMETERS } from '@angular/core/src/util/decorators';

@Directive({
  selector: '[redevableValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: RedevableValidatorDirective, multi: true}]
})
//Si select default value => include errors to control
export class RedevableValidatorDirective implements Validator{
  @Input('redevableValidator') name :string;

  constructor() { }

  validate(control: AbstractControl): { [key: string]: any; } | null {
      switch(this.name){
        case "nom": console.log("You arre select nom");
                    console.log(control.parent.get('prenom') && control.parent.get('prenom').value);
                    let from=control.value;
                    let toCompare=control.parent.get('prenom') && control.parent.get('prenom').value;
                    return from===toCompare?null:{notEqual:true}
        case "prenom": console.log("You arre select prenom");
                    break;
      }
      return null; 
  }
}
