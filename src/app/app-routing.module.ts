import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes, PreloadAllModules } from '@angular/router';
//Component
import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
//import { ControleComponent } from './controle/controle.component';
//import { ParametresComponent } from './parametres/parametres.component';
import { RegieComponent } from './regie/regie.component';
import { RoleComponent } from './role/role.component';
//import { AdminComponent } from './admin/admin.component';
//import { BatchComponent } from './batch/batch.component';
import { RechercheRedevableComponent } from './role/recherche-redevable/recherche-redevable.component';
import { CreationRedevableComponent } from './role/creation-redevable/creation-redevable.component';
import { AlerteRedevableComponent } from './role/alerte-redevable/alerte-redevable.component';
//import { AlerteControleComponent } from './controle/alerte-controle/alerte-controle.component';
import { ListRedevableComponent } from './role/list-redevable/list-redevable.component';
import { ModificationEmplacementComponent } from './role/modification-emplacement/modification-emplacement.component';
import { ListOuvrageComponent } from './role/list-ouvrage/list-ouvrage.component';
import { ModificationOuvrageComponent } from './role/modification-ouvrage/modification-ouvrage.component';
import { ModificationBaremeComponent } from './parametres/modification-bareme/modification-bareme.component';
import { ListeBaremeComponent } from './parametres/liste-bareme/liste-bareme.component';
import { ModificationTaxeComponent } from './admin/modification-taxe/modification-taxe.component';
import { ListeTaxeComponent } from './admin/liste-taxe/liste-taxe.component';
//services
import { ListRedevablesResolverService } from './services/list-redevables-resolver.service';
import { EmplacementResolverService } from './services/emplacement-resolver.service';
import { OuvrageResolverService } from './services/ouvrage-resolver.service';

import { BaremeResolverService } from './services/bareme-resolver.service';

import { NouvelEmplacementComponent } from './role/nouvel-emplacement/nouvel-emplacement.component';
import { ListeMarcheComponent } from './parametres/liste-marche/liste-marche.component';
import { ModificationMarcheComponent } from './parametres/modification-marche/modification-marche.component';
import { InfoPaiementComponent } from './regie/info-paiement/info-paiement.component';
import { TransfertEmplacementComponent } from './batch/transfert-emplacement/transfert-emplacement.component';


const routes:Routes=[
  { path:'Accueil',component:AccueilComponent},
  { path:'',component:AccueilComponent},
  { path:'**',redirectTo: '', pathMatch: 'full'}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes,{
      preloadingStrategy:PreloadAllModules,
      scrollPositionRestoration:'enabled',
      anchorScrolling:'enabled'
    })
  ],
  declarations: [],
  exports:[RouterModule]
})
export class AppRoutingModule { }
