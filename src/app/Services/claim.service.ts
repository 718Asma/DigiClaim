import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim } from '../Classes/claim';

@Injectable({
  providedIn: 'root',
})

export class ClaimService
{
  private apiUrl = 'http://localhost:5000/api/claims';

  constructor(private http: HttpClient) {}

  getClaims(): Observable<Claim[]>
  {
    return this.http.get<Claim[]>(this.apiUrl);
  }

  getClaim(claim_id: string): Observable<Claim>
  {
    const url = `${this.apiUrl}/${claim_id}`;
    return this.http.get<Claim>(url);
  }

  addClaim(claim: Claim): Observable<Claim>
  {
    return this.http.post<Claim>(this.apiUrl, claim);
  }

  updateClaim(claim_id: string, claim: Claim): Observable<Claim>
  {
    const url = `${this.apiUrl}/${claim_id}`;
    return this.http.put<Claim>(url, claim);
  }

  deleteClaim(claim_id: string): Observable<Claim>
  {
    const url = `${this.apiUrl}/${claim_id}`;
    return this.http.delete<Claim>(url);
  }
}
