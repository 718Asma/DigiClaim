import { Component, OnInit } from '@angular/core';
import { Claim } from '../../Classes/claim';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../Services/claim.service';

@Component({
  selector: 'app-details-claim',
  templateUrl: './details-claim.component.html',
  styleUrl: './details-claim.component.css'
})

export class DetailsClaimComponent implements OnInit
{
  id: string = '';
  claim: Claim | undefined;

  constructor(
    private routeur: Router,
    private activatedRoute: ActivatedRoute,
    private claimservice: ClaimService
  ) {}

  ngOnInit(): void
  {
    this.id = this.activatedRoute.snapshot.params['id'];
    
    this.claimservice.getClaims().subscribe(
      claims => {
        this.claim = claims.find(claim => claim.claim_number === this.id);
        if (!this.claim) {
          console.error('Claim not found');
        }
      },
      error => {
        console.error('Error fetching claims', error);
      }
    );
  }
  
  revenir()
  {
    this.routeur.navigate(['/claims']);
  }
}
