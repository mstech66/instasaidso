import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public auth2: any;
  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: environment.CLIENT_URL,
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignIn(document.getElementById('gbutton'));
    });
  }
  attachSignIn(element: HTMLElement) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      const profile = googleUser.getBasicProfile();
      console.log('Name: ' + profile.getName());
    }, (error) => {
      alert(JSON.stringify(error, undefined, 2));
    });
  }

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.googleInit();
  }

}
