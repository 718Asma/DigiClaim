import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-claims-redirect',
  template: '',
})
export class ClaimsRedirectComponent implements OnInit
{
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void
  {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['details', id], { relativeTo: this.route });
  }
}
