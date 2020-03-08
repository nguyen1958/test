import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-creer-refacturation',
  templateUrl: './creer-refacturation.component.html',
  styleUrls: ['./creer-refacturation.component.css']
})
export class CreerRefacturationComponent implements OnInit {

  form:FormGroup;
  formErrors:{[key:string]:any}={};
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.form=this.fb.group({
      annee:this.fb.control('',Validators.required),
      emplacements:this.fb.array([])
    })
  }

  onValider(){

  }

  onSupprimer(){

  }

}
