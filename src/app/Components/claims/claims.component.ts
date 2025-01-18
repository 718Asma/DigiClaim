import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../Services/claim.service';
import { Claim } from '../../Classes/claim';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit
{
  claims: Claim[] = [];
  og_claims: Claim[] = [];

  searchText: string = '';
  selectedStatus: string = '';

  constructor(private claimservice:ClaimService){}

  ngOnInit(): void
  {
    this.fetchClaims();
  }

  fetchClaims(): void
  {
    this.claimservice.getClaims().subscribe(
      data => {
        this.claims = data;
        this.og_claims = data;
      },
      error => {
        console.error('Error fetching claims', error);
      }
    );
  }

  filterClaims(): void
  {
    if (!this.searchText.trim() && !this.selectedStatus)
    {
      this.fetchClaims();
      return;
    }
    else if (!this.searchText.trim())
    {
      this.claims = this.og_claims;
      this.claims = this.claims.filter(claim => claim.status.toLowerCase().includes(this.selectedStatus.toLowerCase()));
      return;
    }
    else if (!this.selectedStatus)
    {
      this.claims = this.claims.filter(claim => claim.claim_number.toLowerCase().includes(this.searchText.toLowerCase()));
      return;
    }
    else
    {
      this.claims = this.claims.filter(claim => claim.claim_number.toLowerCase().includes(this.searchText.toLowerCase()) && claim.status.toLowerCase().includes(this.selectedStatus.toLowerCase()));
      return;
    }
  }

  cancelFilters(): void
  {
    this.searchText = '';
    this.selectedStatus = '';
    this.fetchClaims();
  }

  onSupprimer(claim_id: string): void
  {
    const confirmDelete = window.confirm("Are you sure you want to delete this claim? This action cannot be undone.");
  
    if (confirmDelete)
    {

      this.claimservice.deleteClaim(claim_id).subscribe(
        () => {
          this.fetchClaims();
        },
        error => {
          console.error('Error deleting claim', error);
        }
      );
    }
  }
}
