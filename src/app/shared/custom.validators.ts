import { AbstractControl, FormGroup } from "@angular/forms";

export class CustomValidators{
    //Gestion des validators messages
    //key pair/value is validator/message
    static msgErrors = {
        required:"Ce champs est obligatoire",
        decimal:"Valeur incorrecte", 
        entier:"Valeur doit être un entier positif",
        pattern:"Erreur pattern..."
    }

    static entier(control:AbstractControl):{[key:string]:any}|null{
        let regExp=/^[0-9]+$/;
        let value:string=control.value;
        if(value==='' || regExp.test(value) ){
            return null //OK
        }
        else{
            return {'entier':true} //add customValidator to control.errors
        }
    }

    static decimal(control:AbstractControl):{[key:string]:any}|null{
        let regExp=/^\d+(\.\d{1,2})?$/;
        let value:string=control.value;
        if(value==='' || regExp.test(value) ){
            return null //OK
        }
        else{
            return {'decimal':true} //add customValidator to control.errors
        }
    }

     //CustomValidator with parameters
     static pattern(regExp:RegExp){
        return (control:AbstractControl):{[key:string]:any}|null =>{
            let value:string=control.value;
            if(value==='' || regExp.test(value) ){
                return null //OK
            }
            else{
                return {'pattern':true} //add customValidator to control.errors
            }
        };
    }

    //CustomValidator without parameters
    static endWith(control:AbstractControl):{[key:string]:any}|null{
        let value:string=control.value;
        if(value==='' || value.endsWith('.fr') ){
            return null //OK
        }
        else{
            return {'customValidator':true} //add customValidator to control.errors
        }
    }
    //CustomValidator with parameters
    static endWithArg(arg:string){
        return (control:AbstractControl):{[key:string]:any}|null =>{
            let value:string=control.value;
            if(value==='' || value.endsWith(arg) ){
                return null //OK
            }
            else{
                return {'customValidator':true} //add customValidator to control.errors
            }
        };
    }
    /**
    * Détecter et afficher les erreurs du formulaire
    **/
    static detectErrors(group: FormGroup,formErrors:any): void {
        Object.keys(group.controls).forEach((key: string) => {
          const abstractControl = group.get(key);
          formErrors[key]='';
          //si control is not valid and is touched or dirty
          if (abstractControl && !abstractControl.valid &&
              (abstractControl.touched || abstractControl.dirty)){
            for(const errorkey in abstractControl.errors){
              formErrors[key]+=this.msgErrors[errorkey]+' ';
            }
          }   
          if (abstractControl instanceof (FormGroup)) {
            CustomValidators.detectErrors(abstractControl,formErrors)
          } 
        });
    }
}