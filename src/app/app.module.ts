import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { ErrorComponent } from './Components/error/error.component';
import { ClaimsComponent } from './Components/claims/claims.component';
import { SelectedClaimComponent } from './Components/selected-claim/selected-claim.component';
import { DetailsClaimComponent } from './Components/details-claim/details-claim.component';
import { ContractComponent } from './Components/contract/contract.component';
import { PhotoComponent } from './Components/photo/photo.component';
import { AddClaimComponent } from './Components/add-claim/add-claim.component';
import { EditClaimComponent } from './Components/edit-claim/edit-claim.component';
import { EditPhotoComponent } from './Components/edit-photo/edit-photo.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    ClaimsComponent,
    SelectedClaimComponent,
    DetailsClaimComponent,
    ContractComponent,
    PhotoComponent,
    AddClaimComponent,
    EditClaimComponent,
    EditPhotoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbAlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
