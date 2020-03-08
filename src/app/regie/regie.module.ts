import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegieComponent } from './regie.component';
import { SharedModule } from '../shared/shared.module';
import { InfoPaiementComponent } from './info-paiement/info-paiement.component';
import { RecherchePaiementComponent } from './recherche-paiement/recherche-paiement.component';
import { CreationRedevableComponent } from '../role/creation-redevable/creation-redevable.component';
import { RechercheFactureComponent } from './recherche-facture/recherche-facture.component';
import { ListPaiementComponent } from './list-paiement/list-paiement.component';
import { ListFactureComponent } from './list-facture/list-facture.component';
import { InfoFactureComponent } from './info-facture/info-facture.component';
import { InfoBatchFactureComponent } from './info-batch-facture/info-batch-facture.component';
import { SaisiePaiementMarcheComponent } from './saisie-paiement-marche/saisie-paiement-marche.component';
import { ModificationEmplacementComponent } from '../role/modification-emplacement/modification-emplacement.component';
import { EmplacementResolverService } from '../services/emplacement-resolver.service';
import { ListOuvrageComponent } from '../role/list-ouvrage/list-ouvrage.component';
import { NouvelEmplacementComponent } from '../role/nouvel-emplacement/nouvel-emplacement.component';
import { ModificationOuvrageComponent } from '../role/modification-ouvrage/modification-ouvrage.component';
import { OuvrageResolverService } from '../services/ouvrage-resolver.service';
import { ModificationBaremeComponent } from '../parametres/modification-bareme/modification-bareme.component';
import { BaremeResolverService } from '../services/bareme-resolver.service';
import { ModificationTaxeComponent } from '../admin/modification-taxe/modification-taxe.component';
import { ListeTaxeComponent } from '../admin/liste-taxe/liste-taxe.component';
import { ListeBaremeComponent } from '../parametres/liste-bareme/liste-bareme.component';

const routes:Routes=[
  { path:'Régie',component:RegieComponent,
    children: [
      { path: 'Recherche de paiement', component:RecherchePaiementComponent },
      { path: 'Création d\'un redevable', component: CreationRedevableComponent },
      { path: 'Recherche de facture', component:RechercheFactureComponent },
      { path: 'Information paiement', component:InfoPaiementComponent },
      { path: 'Information facture', component:InfoFactureComponent },
      { path: 'Info batch', component:InfoBatchFactureComponent },
      { path: 'Saisie de paiement marché', component:SaisiePaiementMarcheComponent },
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
      { path: 'Barème',component: ListeBaremeComponent },
      { path: 'Modification bareme', 
                component: ModificationBaremeComponent,
                resolve:{resultat:BaremeResolverService} },
      { path: 'Modification taxe', 
                component: ModificationTaxeComponent},
      { path: 'Type de taxe',component: ListeTaxeComponent },
      ]
  }
]
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    RegieComponent,
    RecherchePaiementComponent,
    RechercheFactureComponent,
    ListPaiementComponent,
    ListFactureComponent,
    InfoPaiementComponent,
    InfoFactureComponent,
    InfoBatchFactureComponent,
    SaisiePaiementMarcheComponent
  ]
})
export class RegieModule { }
