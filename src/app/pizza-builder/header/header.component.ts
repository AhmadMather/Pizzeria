import { Component } from '@angular/core';
import {AuthService} from "../../auth-service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private authService: AuthService,
              private router: Router) { }

  home() {
    this.router.navigate(['/'] );
  }

  purchaseHistory() {
    this.router.navigate(['/history'] );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'] );
  }

}
