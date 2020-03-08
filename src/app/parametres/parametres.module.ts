import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { Routes, RouterModule } from "@angular/router";
import { ParametresComponent } from "./parametres.component";
import { ListeBaremeComponent } from "./liste-bareme/liste-bareme.component";
import { ListeMarcheComponent } from "./liste-marche/liste-marche.component";
import { ModificationBaremeComponent } from "./modification-bareme/modification-bareme.component";
import { BaremeResolverService } from "../services/bareme-resolver.service";
import { ModificationTaxeComponent } from "../admin/modification-taxe/modification-taxe.component";
import { ModificationMarcheComponent } from "./modification-marche/modification-marche.component";
import { ListeTaxeComponent } from "../admin/liste-taxe/liste-taxe.component";

const routes:Routes=[
    { path:'Paramètres',component:ParametresComponent,
  children: [
    { path: 'Barème', component:ListeBaremeComponent },
    { path: 'Type de taxe', component:ListeTaxeComponent },
    { path: 'Marché' , component: ListeMarcheComponent },
    { path: 'Modification bareme', 
              component: ModificationBaremeComponent,
              resolve:{resultat:BaremeResolverService} },
    { path: 'Modification taxe', 
              component: ModificationTaxeComponent},
    { path: 'Modification marche', 
              component: ModificationMarcheComponent}
    ]
  }
]
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ParametresComponent,
        ListeBaremeComponent,
        ListeMarcheComponent,
        ModificationBaremeComponent,
        ModificationMarcheComponent
    ],
    exports:[RouterModule]
})
export class ParametresModule{}