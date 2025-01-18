import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../Services/claim.service';
import { ContractService } from '../../Services/contract.service';
import { InsuredService } from '../../Services/insured.service';
import { VehicleService } from '../../Services/vehicle.service';
import { Claim } from '../../Classes/claim';
import { Contract } from '../../Classes/contract';
import { Insured } from '../../Classes/insured';
import { Vehicle } from '../../Classes/vehicle';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.css'
})

export class ContractComponent implements OnInit
{
  id: string = '';
  claim: Claim | undefined;
  contract: Contract | undefined;
  insured: Insured | undefined;
  vehicle: Vehicle | undefined;

  constructor(
    private routeur: Router,
    private activatedRoute: ActivatedRoute,
    private claimservice: ClaimService,
    private contractService: ContractService,
    private insuredService: InsuredService,
    private vehicleService: VehicleService
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

    this.contractService.getContracts().subscribe(
      contracts => {
        this.contract = contracts.find(contract => contract.contract_number === this.claim?.contract_number);
        if (!this.contract) {
          console.error('Contract not found');
        }
      },
      error => {
        console.error('Error fetching contracts', error);
      }
    );

    this.insuredService.getInsureds().subscribe(
      insureds => {
        this.insured = insureds.find(insured => insured.insured_name === this.contract?.insured_name);
        if (!this.insured) {
          console.error('Insured not found');
        }
      },
      error => {
        console.error('Error fetching insureds', error);
      }
    );

    this.vehicleService.getVehicles().subscribe(
      vehicles => {
        this.vehicle = vehicles.find(vehicle => vehicle.vehicle_registration_number === this.contract?.vehicle_registration_number);
        if (!this.vehicle)
        {
          console.error('Vehicle not found');
        }
      },
      error => {
        console.error('Error fetching vehicles', error);
      }
    );
  }
  
  revenir()
  {
    this.routeur.navigate(['/claims']);
  }
}
