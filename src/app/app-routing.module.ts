import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  // Adding the AuthGuard here we perfom the access control here and if we are not allowed we do not download
  // training module. If we put the check in the lazy loaded router module (training-routing.module.ts) the module
  // will be downloaded first and then we will check the authentication.
  // canLoad is like canActivate but it runs before the lazy loaded bundle is loaded.
  {path: 'training', loadChildren: './modules/training.module#TrainingModule', canLoad: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
