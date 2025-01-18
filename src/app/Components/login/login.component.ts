import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../Services/users.service';
import { Users } from '../../Classes/users';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent
{
  loginForm!: FormGroup;
  users: Users[] = [];

  constructor(
    private routeur: Router,
    private fb: FormBuilder,
    private usersService: UsersService
  ) {}

  ngOnInit(): void
  {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.usersService.getUsers().subscribe(
      data => {
        this.users = data;
      }
    );
  }

  login()
  {
    if (this.loginForm.valid)
    {
      if(this.usersService.login(this.loginForm.value.username, this.loginForm.value.password))
      {
        const user = this.users.find(user => user.user_email === this.loginForm.value.username || user.user_phone_number === this.loginForm.value.username);
        this.routeur.navigate(['/claims']);
      }
      else
      {
        alert("Login ou mot de passe incorrect !");
      }
    }
    else
    {
      alert("Veuillez entrer vos informations d'abord !");
    }
  }
}