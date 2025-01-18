  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  import { Claim } from '../../Classes/claim';
  import { Contract } from '../../Classes/contract';
  import { ClaimService } from '../../Services/claim.service';
  import { ContractService } from '../../Services/contract.service';

  @Component({
    selector: 'app-edit-claim',
    templateUrl: './edit-claim.component.html',
    styleUrls: ['./edit-claim.component.css']
  })

  export class EditClaimComponent implements OnInit
  {
    editForm: FormGroup;
    Contract: string[] = [];
    
    id: string = '';
    claim: Claim | undefined;

    constructor(
      private router: Router,
      private fb: FormBuilder,
      private claimService: ClaimService,
      private contractService: ContractService,
      private activatedRoute: ActivatedRoute
    ){
      this.editForm = this.fb.group({
        claim_number: ['', Validators.required],
        accident_date: ['', Validators.required],
        creation_date: ['', Validators.required],
        status: ['', Validators.required],
        contract_number: ['', Validators.required]
      });
    }

    ngOnInit(): void {
      this.id = this.activatedRoute.snapshot.params['id'];
      
      this.fetchContractNumbers(); 
    
      this.claimService.getClaim(this.id).subscribe(
        claim => {
          if (claim)
          {
            this.claim = claim;

            const accident_date = new Date(claim.accident_date).toISOString().split('T')[0];
            const creation_date = new Date(claim.creation_date).toISOString().split('T')[0];

            this.editForm = this.fb.group({
              claim_number: [claim.claim_number, Validators.required],
              accident_date: [accident_date, Validators.required],
              creation_date: [creation_date, Validators.required],
              status: [claim.status, Validators.required],
              contract_number: [claim.contract_number, Validators.required]
            });
          }
          else
          {
            console.error('Claim not found or null.');
          }
        },
        error => {
          console.error('Error fetching claim:', error);
        }
      );
    }
    

    fetchContractNumbers()
    {
      this.contractService.getContracts().subscribe(
        (data: Contract[]) => {
          data.forEach(elt => this.Contract.push(elt.contract_number));
        },
        error => {
          console.error('Error fetching contract numbers', error);
        }
      );
    }

    onSubmitForm()
    {
      if (this.editForm.valid && this.claim)
      {
        const claim = this.editForm.value;
        this.claimService.updateClaim(this.claim.claim_number, claim).subscribe(
          () => {
            alert('Claim updated successfully!');
            this.router.navigate(['/claims']);
          },
          error => {
            console.error('Error updating claim', error);
          }
        );
        alert('Claim edited successfully!');
        this.router.navigate(['/claims']);
      }
      else
      {
        alert('Veuillez vérifier le formulaire !');
      }
    }

    onResetForm()
    {
      this.editForm.reset();
    }

    revenir(): void
    {
      this.router.navigate(['/claims']);
    }
  }
