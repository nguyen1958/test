import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-refacturation',
  templateUrl: './refacturation.component.html',
  styleUrls: ['./refacturation.component.css']
})
export class RefacturationComponent implements OnInit {
  action="rechercher";
  mainForm:FormGroup;
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.mainForm=this.fb.group({
      annee:this.fb.control('',Validators.required),
      emplacements:this.fb.array([])
    })
  }

}
