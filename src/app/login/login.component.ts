import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../auth-service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;

  error = false;
  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });
  constructor(private authService: AuthService,
              private router: Router) { }

  login() {
    if (!this.loginForm.value.username || !this.loginForm.value.password) {
      this.error = true;
      this.loginForm.reset()
    } else {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
        (data: any) => {
          window.localStorage.setItem('user', data?.token);
          this.router.navigate(['/']);
        },
        () => {
          this.error = true;
          this.loginForm.reset()
        }
      )
    }
  }
}
