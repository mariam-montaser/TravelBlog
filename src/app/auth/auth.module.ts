import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MaterialModule } from '../material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        AuthRoutingModule
    ]
})
export class AuthModule { }