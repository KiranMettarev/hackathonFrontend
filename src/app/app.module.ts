
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./view/login/login/login.component";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgOtpInputModule } from "ng-otp-input";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./view/home/home.component";
import { LayoutComponent } from "./view/layout/layout.component";
import { AppRoutingModule } from "./app.routes";
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from "@angular/common/http";
import { jwtInterceptor, unauthErrorInterceptor } from "./interceptors/jwt.interceptors";
import { LoadingComponent } from "./view/generic/loading/loading.component";
import { AadharComponent } from "./view/KYC/aadhar/aadhar.component";
import { PanComponent } from "./view/KYC/pan/pan.component";
import { BillComponent } from "./view/KYC/bill/bill.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LayoutComponent,
    LoadingComponent,
    AadharComponent,
    PanComponent,
    BillComponent
  ],

  bootstrap: [AppComponent],

  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    AppRoutingModule,
],

   providers: [
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([jwtInterceptor, unauthErrorInterceptor]),
    ),
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
