import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent
{
  constructor(private routeur:Router){}

  revenir()
  {
    this.routeur.navigate(['/claims']);
  }
}
