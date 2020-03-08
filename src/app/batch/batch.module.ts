import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BatchComponent } from './batch.component';
import { SharedModule } from '../shared/shared.module';
import { BatchTraitementComponent } from './batch-traitement/batch-traitement.component';
import { BatchRapportComptableComponent } from './batch-rapport-comptable/batch-rapport-comptable.component';
import { HistoriqueBatchComponent } from './historique-batch/historique-batch.component';
import { RapportsComponent } from './rapports/rapports.component';
import { RefacturationComponent } from './refacturation/refacturation.component';
import { TraitementDiversComponent } from './traitement-divers/traitement-divers.component';
import { InfoBatchComponent } from './info-batch/info-batch.component';

import { TransfertEmplacementComponent } from './transfert-emplacement/transfert-emplacement.component';
import { ChangementAdresseRedevableComponent } from './changement-adresse-redevable/changement-adresse-redevable.component';
import { BasculeTaxeBaremeComponent } from './bascule-taxe-bareme/bascule-taxe-bareme.component';
import { CreationRedevableComponent } from '../role/creation-redevable/creation-redevable.component';
import { ListOuvrageComponent } from '../role/list-ouvrage/list-ouvrage.component';
import { EmplacementResolverService } from '../services/emplacement-resolver.service';
import { ModificationOuvrageComponent } from '../role/modification-ouvrage/modification-ouvrage.component';
import { OuvrageResolverService } from '../services/ouvrage-resolver.service';
import { NouvelEmplacementComponent } from '../role/nouvel-emplacement/nouvel-emplacement.component';
import { ModificationEmplacementComponent } from '../role/modification-emplacement/modification-emplacement.component';
import { ListRedevableComponent } from '../role/list-redevable/list-redevable.component';
import { ListRedevablesResolverService } from '../services/list-redevables-resolver.service';
import { ListeBaremeComponent } from '../parametres/liste-bareme/liste-bareme.component';
import { ModificationBaremeComponent } from '../parametres/modification-bareme/modification-bareme.component';
import { BaremeResolverService } from '../services/bareme-resolver.service';
import { ModificationTaxeComponent } from '../admin/modification-taxe/modification-taxe.component';
import { ListeTaxeComponent } from '../admin/liste-taxe/liste-taxe.component';
import { RechercheRefacturationComponent } from './recherche-refacturation/recherche-refacturation.component';
import { CreerRefacturationComponent } from './creer-refacturation/creer-refacturation.component';

const routes:Routes=[
  { path:'Batch',component:BatchComponent,
    children: [
    { path: 'Batch traitement', component:BatchTraitementComponent },
    { path: 'Batch rapport comptable', component:BatchRapportComptableComponent },
    { path: 'Traitements divers', component:TraitementDiversComponent },
    { path: 'Historique des batchs', component:HistoriqueBatchComponent },
    { path: 'Refacturation', component:RefacturationComponent },
    { path: 'Rapports', component:RapportsComponent },
    { path: 'Info batch/:typeBatch', component:InfoBatchComponent },
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
  
    ]
  }
]
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    BatchComponent,
    BatchTraitementComponent,
    BatchRapportComptableComponent,
    HistoriqueBatchComponent,
    TraitementDiversComponent,
    RapportsComponent,
    RefacturationComponent,
    InfoBatchComponent,
    TransfertEmplacementComponent,
    ChangementAdresseRedevableComponent,
    BasculeTaxeBaremeComponent,
    RechercheRefacturationComponent,
    CreerRefacturationComponent
  ]
})
export class BatchModule { }
