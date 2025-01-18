import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from '../Classes/contract';

@Injectable({
  providedIn: 'root'
})

export class ContractService
{
  private apiUrl = 'http://localhost:5000/api/contract';

  constructor(private http: HttpClient) {}

  getContracts(): Observable<Contract[]>
  {
    return this.http.get<Contract[]>(this.apiUrl);
  }

  getContract(id: number): Observable<Contract>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Contract>(url);
  }

  addContract(contract: Contract): Observable<Contract>
  {
    return this.http.post<Contract>(this.apiUrl, contract);
  }

  updateContract(id: number, contract: Contract): Observable<Contract>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Contract>(url, contract);
  }

  deleteContract(id: number): Observable<Contract>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Contract>(url);
  }
}