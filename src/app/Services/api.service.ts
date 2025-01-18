// api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // Replace with your Node.js server URL

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any>
  {
    return this.http.get(`${this.baseUrl}/users`);
  }

  // Add more methods for other API endpoints
}
