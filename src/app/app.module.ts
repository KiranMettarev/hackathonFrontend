
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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LayoutComponent
  ],

  bootstrap: [AppComponent],

  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    AppRoutingModule,
],

  providers: [
    provideAnimationsAsync()
  ],
})
export class AppModule {}
