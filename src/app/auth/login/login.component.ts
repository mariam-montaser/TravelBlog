import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSub = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isLoading = false;
    })
  }

  onLogin(form: NgForm) {
    console.log(form);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password)
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
