import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insured } from '../Classes/insured';

@Injectable({
  providedIn: 'root'
})

export class InsuredService
{
  private apiUrl = 'http://localhost:5000/api/insured';

  constructor(private http: HttpClient) {}

  getInsureds(): Observable<Insured[]>
  {
    return this.http.get<Insured[]>(this.apiUrl);
  }

  getInsured(id: number): Observable<Insured>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Insured>(url);
  }

  addInsured(insured: Insured): Observable<Insured>
  {
    return this.http.post<Insured>(this.apiUrl, insured);
  }

  updateInsured(id: number, insured: Insured): Observable<Insured>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Insured>(url, insured);
  }

  deleteInsured(id: number): Observable<Insured>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Insured>(url);
  }
}
