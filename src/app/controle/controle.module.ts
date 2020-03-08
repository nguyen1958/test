import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { Routes, RouterModule } from '@angular/router';
import { ControleComponent } from './controle.component';
import { AlerteControleComponent } from './alerte-controle/alerte-controle.component';
import { CreationRedevableComponent } from '../role/creation-redevable/creation-redevable.component';
import { ModificationOuvrageComponent } from '../role/modification-ouvrage/modification-ouvrage.component';
import { ListCommuniqueComponent } from './list-communique/list-communique.component';
import { ModificationEmplacementComponent } from '../role/modification-emplacement/modification-emplacement.component';
import { OuvrageResolverService } from '../services/ouvrage-resolver.service';
import { EmplacementResolverService } from '../services/emplacement-resolver.service';
import { ListRedevableComponent } from '../role/list-redevable/list-redevable.component';
import { ListRedevablesResolverService } from '../services/list-redevables-resolver.service';
import { ListOuvrageComponent } from '../role/list-ouvrage/list-ouvrage.component';
import { ModificationBaremeComponent } from '../parametres/modification-bareme/modification-bareme.component';
import { BaremeResolverService } from '../services/bareme-resolver.service';
import { ListeBaremeComponent } from '../parametres/liste-bareme/liste-bareme.component';
import { NouvelEmplacementComponent } from '../role/nouvel-emplacement/nouvel-emplacement.component';
import { ModificationTaxeComponent } from '../admin/modification-taxe/modification-taxe.component';
import { ListeTaxeComponent } from '../admin/liste-taxe/liste-taxe.component';
import { HistoriqueSynchronisationComponent } from './historique-synchronisation/historique-synchronisation.component';
import { RuptureControleComponent } from './rupture-controle/rupture-controle.component';
import { HistoriqueControleComponent } from './historique-controle/historique-controle.component';
import { ListReclamationComponent } from './list-reclamation/list-reclamation.component';
import { ModificationReclamationComponent } from './modification-reclamation/modification-reclamation.component';
import { NouvelleReclamationComponent } from './nouvelle-reclamation/nouvelle-reclamation.component';
import { InfoFactureComponent } from '../regie/info-facture/info-facture.component';
import { InfoPaiementComponent } from '../regie/info-paiement/info-paiement.component';
import { InfoBatchFactureComponent } from '../regie/info-batch-facture/info-batch-facture.component';
import { RechercheFactureComponent } from '../regie/recherche-facture/recherche-facture.component';

const routes:Routes=[
  { path:'Contrôle',component:ControleComponent,
children: [
  { path: 'Alerte', component:AlerteControleComponent },
  { path: `Réclamation`,component:ListReclamationComponent },
  { path: 'Liste des communiqués',component:ListCommuniqueComponent },
  { path: 'Historique synchronisation',component:HistoriqueSynchronisationComponent },  
  { path: 'Historique des contrôles',component:HistoriqueControleComponent },  
  { path: 'Rupture des contrôles',component:RuptureControleComponent },  
  { path: 'Création d\'un redevable', component:CreationRedevableComponent },
  { path: 'Liste des redevables',
          component: ListRedevableComponent,
          resolve:{redevables:ListRedevablesResolverService} }, 
  { path: 'Liste des ouvrages', 
          component: ListOuvrageComponent,
          resolve:{resultat:EmplacementResolverService} },
  { path: 'Modification ouvrage', 
          component: ModificationOuvrageComponent,
          resolve:{resultat:OuvrageResolverService} },
  { path: 'Nouvel emplacement', component: NouvelEmplacementComponent },
  { path: 'Modification de l\'emplacement', 
          component: ModificationEmplacementComponent,
          resolve:{resultat:EmplacementResolverService} },
  { path: 'Barème',component: ListeBaremeComponent }, 
  { path: 'Modification bareme', 
          component: ModificationBaremeComponent,
          resolve:{resultat:BaremeResolverService} },
  { path: 'Modification taxe', 
          component: ModificationTaxeComponent},
  { path: 'Type de taxe',component: ListeTaxeComponent },
  { path: 'Modification reclamation',component: ModificationReclamationComponent },
  { path: 'Nouvelle reclamation',component: NouvelleReclamationComponent },
  { path: 'Information facture', component:InfoFactureComponent },
  { path: 'Information paiement', component:InfoPaiementComponent },
  { path: 'Info batch', component:InfoBatchFactureComponent },
  { path: 'Recherche de facture', component:RechercheFactureComponent },
  ]
}
]
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ControleComponent,
    AlerteControleComponent,
    ListCommuniqueComponent,
    HistoriqueSynchronisationComponent,
    RuptureControleComponent,
    HistoriqueControleComponent,
    ListReclamationComponent,
    ModificationReclamationComponent,
    NouvelleReclamationComponent,
  ]
})
export class ControleModule { }
