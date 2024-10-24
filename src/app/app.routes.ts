import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './view/login/login/login.component';
import { HomeComponent } from './view/home/home.component';
import { PageLayout } from './view/layout/pageLayout';
import { setLayout } from './view/layout/layoutResolver';
import { NgModule } from '@angular/core';
import { WelcomeComponent } from './view/welcome/welcome/welcome.component';
import { BankOffersComponent } from './view/bank-offers/bank-offers.component';


const user: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },

];
const unAuthorize: Routes = [
  { path: "", redirectTo: "/welcome", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "welcome", component: WelcomeComponent },

];

const routes: Routes = [
  {
    path: "",
    children: unAuthorize,
    resolve: { layout: setLayout(PageLayout.unAuthorized) },
  },
  {
    path: "user",
    children: user.map((r) => ({
      ...r,
      resolve: { layout: setLayout(PageLayout.authorized) },
    })),
    resolve: { layout: setLayout(PageLayout.authorized) },
    // canActivateChild: [authChildGuard],
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

