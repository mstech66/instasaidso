import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstaService {
  count = 1;
  headers = {
    'Content-Type': 'Application/json',
    'auth-token': environment.TOKEN_SECRET
  };

  constructor(private httpClient: HttpClient) {
  }

  getData() {
    return this.httpClient.get<any>(`api/quotes`, { headers: this.headers }).toPromise();
  }
}
