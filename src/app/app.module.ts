import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ParametresModule } from './parametres/parametres.module';
import { AdminModule } from './admin/admin.module';
import { ControleModule } from './controle/controle.module';
import { BatchModule } from './batch/batch.module';
import { RegieModule } from './regie/regie.module';
import { RoleModule } from './role/role.module';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'ngx-bootstrap/carousel';
//components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';

@NgModule({
  declarations: [
    AppComponent, 
    LoginComponent,
    AccueilComponent,
  ],
  imports: [
    BrowserModule,
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ParametresModule,
    AdminModule,
    ControleModule,
    BatchModule,
    RegieModule,
    RoleModule,
    AppRoutingModule,  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
