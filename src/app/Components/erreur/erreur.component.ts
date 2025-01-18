import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-erreur',
  templateUrl: './erreur.component.html',
  styleUrls: ['./erreur.component.css']
})
export class ErreurComponent
{
  constructor(private routeur:Router){}

  revenir()
  {
    this.routeur.navigate(['/home']);
  }
}
