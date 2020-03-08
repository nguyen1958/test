import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { RoleComponent } from './role.component';
import { RechercheRedevableComponent } from './recherche-redevable/recherche-redevable.component';
import { CreationRedevableComponent } from './creation-redevable/creation-redevable.component';
import { ListRedevableComponent } from './list-redevable/list-redevable.component';
import { ListRedevablesResolverService } from '../services/list-redevables-resolver.service';
import { ListeBaremeComponent } from '../parametres/liste-bareme/liste-bareme.component';
import { AlerteRedevableComponent } from './alerte-redevable/alerte-redevable.component';
import { NouvelEmplacementComponent } from './nouvel-emplacement/nouvel-emplacement.component';
import { ModificationEmplacementComponent } from './modification-emplacement/modification-emplacement.component';
import { EmplacementResolverService } from '../services/emplacement-resolver.service';
import { ListOuvrageComponent } from './list-ouvrage/list-ouvrage.component';
import { ModificationOuvrageComponent } from './modification-ouvrage/modification-ouvrage.component';
import { OuvrageResolverService } from '../services/ouvrage-resolver.service';
import { ModificationBaremeComponent } from '../parametres/modification-bareme/modification-bareme.component';
import { BaremeResolverService } from '../services/bareme-resolver.service';
import { ModificationTaxeComponent } from '../admin/modification-taxe/modification-taxe.component';
import { ListeTaxeComponent } from '../admin/liste-taxe/liste-taxe.component';
import { InfoPaiementComponent } from '../regie/info-paiement/info-paiement.component';
import { TransfertEmplacementComponent } from '../batch/transfert-emplacement/transfert-emplacement.component';
import { PhotoEmplacementComponent } from './photo-emplacement/photo-emplacement.component';
import { DocumentEmplacementComponent } from './document-emplacement/document-emplacement.component';

const routes=[
  { path:'Rôle',component:RoleComponent,
    children: [
    { path: '', component:RechercheRedevableComponent },
    { path: 'Recherche d\'un redevable', component: RechercheRedevableComponent },
    { path: 'Création d\'un redevable', component: CreationRedevableComponent },
    { path: 'Liste des redevables',
              component: ListRedevableComponent,
              resolve:{redevables:ListRedevablesResolverService} },
    { path: 'Barème',component: ListeBaremeComponent },  
    { path: 'Alerte', component: AlerteRedevableComponent },
    { path: 'Nouvel emplacement', component: NouvelEmplacementComponent },
    { path: 'Modification de l\'emplacement', 
              component: ModificationEmplacementComponent,
              resolve:{resultat:EmplacementResolverService} },
    { path: 'Liste des ouvrages', 
              component: ListOuvrageComponent,
              resolve:{resultat:EmplacementResolverService} },
    { path: 'Modification ouvrage', 
              component: ModificationOuvrageComponent,
              resolve:{resultat:OuvrageResolverService} },
    { path: 'Modification bareme', 
              component: ModificationBaremeComponent,
              resolve:{resultat:BaremeResolverService} },
    { path: 'Modification taxe', 
              component: ModificationTaxeComponent},
    { path: 'Type de taxe',component: ListeTaxeComponent },
    { path: 'Info paiement', component:InfoPaiementComponent },
    { path: 'Transfert emplacement', component:TransfertEmplacementComponent},
    ]
  }]


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
],
declarations: [
  RoleComponent,
  RechercheRedevableComponent,
  CreationRedevableComponent,
  AlerteRedevableComponent,
  ListRedevableComponent,
  ModificationEmplacementComponent,
  PhotoEmplacementComponent,
  ListOuvrageComponent,
  DocumentEmplacementComponent,
  ModificationOuvrageComponent,
  NouvelEmplacementComponent,
],
exports:[RouterModule]
})
export class RoleModule { }
