import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../Classes/photo';

@Injectable({
  providedIn: 'root'
})

export class PhotoService
{
  private apiUrl = 'http://localhost:5000/api/photo';

  constructor(private http: HttpClient) {}

  getPhotos(): Observable<Photo[]>
  {
    return this.http.get<Photo[]>(this.apiUrl);
  }

  getPhoto(id: number): Observable<Photo>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Photo>(url);
  }

  uploadPhoto(formData: FormData)
  {
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

  updatePhoto(id: string, photo: Photo): Observable<Photo>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Photo>(url, photo);
  }

  deletePhoto(id: string): Observable<Photo>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Photo>(url);
  }
}
