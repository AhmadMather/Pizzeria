import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {PizzaBuilderComponent} from "./pizza-builder/pizza-builder.component";
import {AuthGuard} from "./auth-service/auth.guard";
import {HistoryComponent} from "./history/history.component";

const routes: Routes = [
  {
    path: '',
    component: PizzaBuilderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
