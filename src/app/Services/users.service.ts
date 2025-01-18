import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../Classes/users';

@Injectable({
  providedIn: 'root'
})

export class UsersService
{
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http:HttpClient)
  {
    this.getUsers().subscribe(
      data => {
        this.lesUtilisateurs = data;
      }
    )
  }

  getUsers(): Observable<Users[]>
  {
    return this.http.get<Users[]>(this.apiUrl);
  }


  getUser(id: number): Observable<Users>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Users>(url);
  }


  addUser(Users: Users): Observable<Users>
  {
    return this.http.post<Users>(this.apiUrl, Users);
  }


  updateUser(id: number, Users: Users): Observable<Users>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Users>(url, Users);
  }


  deleteUser(id: number): Observable<Users>
  {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Users>(url);
  }

  private authenticated = false;
  lesUtilisateurs : Users[] = [];


  public login(username: string, pwd: string)
  {
    for(let i=0; i<this.lesUtilisateurs.length; i++)
    {
      if(username == this.lesUtilisateurs[i].user_email && pwd == this.lesUtilisateurs[i].user_password || username == this.lesUtilisateurs[i].user_phone_number && pwd == this.lesUtilisateurs[i].user_password)
      {
        return this.authenticated = true;
      }
    }
    return this.authenticated;
  }

  public logout()
  {
    this.authenticated = false;
  }

  public isAuthenticated()
  {
    return this.authenticated;
  }
}
