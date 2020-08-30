import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    const user = {
      email: credential.user.email,
      name: credential.user.displayName,
      picture: credential.user.photoURL
    };
    localStorage.setItem('user_profile', JSON.stringify(user));
    location.replace('http://localhost:4200/home');
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user_profile');
    location.replace('http://localhost:4200/home');
  }
}
