import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { AdminComponent } from './admin.component';
import { ModificationTaxeComponent } from './modification-taxe/modification-taxe.component';
import { ListeTaxeComponent } from './liste-taxe/liste-taxe.component';
import { ListeUtilisateurComponent } from './liste-utilisateur/liste-utilisateur.component';
import { ModificationUtilisateurComponent } from './modification-utilisateur/modification-utilisateur.component';
import { ListeRueComponent } from './liste-rue/liste-rue.component';
import { ModificationRueComponent } from './modification-rue/modification-rue.component';
import { ListeParametreComponent } from './liste-parametre/liste-parametre.component';
import { TypeParametreComponent } from './type-parametre/type-parametre.component';
import { HistoriqueTacheComponent } from './historique-tache/historique-tache.component';
import { IdossComponent } from './idoss/idoss.component';
import { InfoIdossComponent } from './info-idoss/info-idoss.component';
import { ModeleCourrierComponent } from './modele-courrier/modele-courrier.component';


const routes:Routes=[
  { path:'Admin',component:AdminComponent,
    children: [
    { path: 'Type de taxe', component:ListeTaxeComponent },
    { path: 'Modification taxe', component: ModificationTaxeComponent},
    { path: 'Utilisateur', component:ListeUtilisateurComponent },
    { path: 'Modification utilisateur', component: ModificationUtilisateurComponent},
    { path: 'Rue', component:ListeRueComponent },
    { path: 'Modification rue', component: ModificationRueComponent},
    { path: 'Paramètre', component:ListeParametreComponent },
    { path: 'Historique des tâches', component:HistoriqueTacheComponent },
    { path: 'Idoss', component:IdossComponent },
    { path: 'Information idoss', component:InfoIdossComponent },
    { path: 'Modèles des courriers', component:ModeleCourrierComponent },
    ]
  }
]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AdminComponent,
    ListeTaxeComponent,
    ModificationTaxeComponent,
    ListeUtilisateurComponent,
    ModificationUtilisateurComponent,
    ListeRueComponent,
    ModificationRueComponent,
    ListeParametreComponent,
    TypeParametreComponent,
    HistoriqueTacheComponent,
    IdossComponent,
    InfoIdossComponent,
    ModeleCourrierComponent,
  ],
  exports:[RouterModule]
})
export class AdminModule { }
