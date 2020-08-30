import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public auth2: any;

  constructor(private auth: AuthService, private router: Router) {
    if (localStorage.getItem('user_profile') != null) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
  }

}
