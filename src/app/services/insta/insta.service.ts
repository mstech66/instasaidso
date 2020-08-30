import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstaService {
  headers = {
    'Content-Type': 'Application/json',
    'auth-token': environment.TOKEN_SECRET
  };

  constructor(private httpClient: HttpClient) {
    this.setCount('0');
  }

  getPosts(posts) {
    const result = this.httpClient.get<any>(`api/quotes?skip=${this.getCount()}&limit=${posts}`, { headers: this.headers });
    this.setCount(`${this.getCount() + posts}`);
    return result;
  }

  getCount() {
    return Number(localStorage.getItem('count'));
  }

  setCount(count) {
    localStorage.setItem('count', count);
  }
}
