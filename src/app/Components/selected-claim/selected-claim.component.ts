import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClaimService } from '../../Services/claim.service';
import { Claim } from '../../Classes/claim';

@Component({
  selector: 'app-selected-claim',
  templateUrl: './selected-claim.component.html',
  styleUrls: ['./selected-claim.component.css']
})

export class SelectedClaimComponent implements OnInit
{
  id: string = '';
  claim: Claim | undefined;

  constructor(
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
}
