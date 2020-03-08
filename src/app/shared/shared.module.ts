import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RedevableValidatorDirective } from './redevable-validator.directive';
import { FilterPipe } from './pipes/filter.pipe';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  imports: [],
  declarations: [
    RedevableValidatorDirective,
    FilterPipe    
  ],
  exports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    CarouselModule,
    RedevableValidatorDirective,
    FilterPipe
  ]
})
export class SharedModule {}
