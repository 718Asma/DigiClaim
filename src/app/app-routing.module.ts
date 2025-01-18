import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { ErrorComponent } from './Components/error/error.component';
import { ClaimsComponent } from './Components/claims/claims.component';
import { loginGuard } from './Guards/login.guard';
import { SelectedClaimComponent } from './Components/selected-claim/selected-claim.component';
import { DetailsClaimComponent } from './Components/details-claim/details-claim.component';
import { ContractComponent } from './Components/contract/contract.component';
import { PhotoComponent } from './Components/photo/photo.component';
import { AddClaimComponent } from './Components/add-claim/add-claim.component';
import { EditClaimComponent } from './Components/edit-claim/edit-claim.component';
import { EditPhotoComponent } from './Components/edit-photo/edit-photo.component';
import { ClaimsRedirectComponent } from './Components/claims-redirect/claims-redirect.component';

const routes: Routes = [
  { path: 'login', title: 'Bienvenue!', component: LoginComponent },
  { path: 'claims', title: 'Claims', component: ClaimsComponent, canActivate:[loginGuard]},
  {path: 'claims/:id', title: 'Claim Info', component: SelectedClaimComponent,
    children: [
      { path: 'details/:id', title: 'Details', component: DetailsClaimComponent },
      { path: 'contract/:id', title: 'Contract', component: ContractComponent },
      { path: 'photo/:id', title: 'Photo', component: PhotoComponent },
      { path: '', component: ClaimsRedirectComponent },
    ]
  },
  { path:'add', title: 'Add Claim', component: AddClaimComponent},
  { path:'edit-claim/:id', title: 'Edit Claim', component: EditClaimComponent},
  { path:'edit-photo/:id', title: 'Edit Photo', component: EditPhotoComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', title: 'Error', component: ErrorComponent }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
