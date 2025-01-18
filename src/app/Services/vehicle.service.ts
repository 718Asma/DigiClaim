import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../Classes/vehicle';

@Injectable({
  providedIn: 'root'
})

export class VehicleService
{
  private apiUrl = 'http://localhost:5000/api/vehicle';

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]>
  {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  getVehicle(id: number): Observable<Vehicle>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Vehicle>(url);
  }

  addVehicle(vehicle: Vehicle): Observable<Vehicle>
  {
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }

  updateVehicle(id: number, vehicle: Vehicle): Observable<Vehicle>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Vehicle>(url, vehicle);
  }

  deleteVehicle(id: number): Observable<Vehicle>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Vehicle>(url);
  }
}