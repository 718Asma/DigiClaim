import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Vehicle } from '../../Classes/vehicle';
import { Insured } from '../../Classes/insured';
import { Contract } from '../../Classes/contract';
import { ClaimService } from '../../Services/claim.service';
import { VehicleService } from '../../Services/vehicle.service';
import { InsuredService } from '../../Services/insured.service';
import { ContractService } from '../../Services/contract.service';

@Component({
  selector: 'app-add-claim',
  templateUrl: './add-claim.component.html',
  styleUrls: ['./add-claim.component.css']
})

export class AddClaimComponent implements OnInit
{
  addClaimForm!: FormGroup;
  addContractForms: FormGroup[] = [];
  addInsuredForms: FormGroup[] = [];
  addVehiculeForms: FormGroup[] = [];

  addContractButtonClicked: boolean = false;
  addInsuredButtonClicked: boolean = false;
  addVehiculeButtonClicked: boolean = false;

  Vehicle: string[] = [];
  Insured: string[] = [];
  Contract: string[] = [];
  
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private claimService: ClaimService,
    private vehicleService: VehicleService,
    private insuredService: InsuredService,
    private contractService: ContractService
  ) {}

  ngOnInit(): void
  {

    this.addClaimForm = this.fb.group({
      claim_number: ['', Validators.required],
      accident_date: [this.today, Validators.required],
      creation_date: [this.today, Validators.required],
      status: ['Ouvert', Validators.required],
      contract_number: [''],
    });

    this.fetchContractNumbers();
    this.fetchInsuredNames();
    this.fetchVehicleRegistrationNumbers();
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

  fetchInsuredNames()
  {
    this.insuredService.getInsureds().subscribe(
      (data: Insured[]) => {
        data.forEach(elt => this.Insured.push(elt.insured_name));
      },
      error => {
        console.error('Error fetching insured names', error);
      }
    );
  }

  fetchVehicleRegistrationNumbers()
  {
    this.vehicleService.getVehicles().subscribe(
      (data: Vehicle[]) => {
        data.forEach(elt => this.Vehicle.push(elt.vehicle_registration_number));
      },
      error => {
        console.error('Error fetching vehicle registration numbers', error);
      }
    );
  }

  addContractForm()
  {
    const newForm = this.fb.group({
      contract_number: ['', Validators.required],
      contract_start_date: [this.today, Validators.required],
      contract_end_date: [this.today, Validators.required],
      insured_name: [''],
      vehicle_registration_number: ['']
    });
    this.addContractForms.push(newForm);
    this.addContractButtonClicked = true;
  }

  removeContractForm(index: number)
  {
    this.addContractForms.splice(index, 1);
    this.addContractButtonClicked = false;
  }

  addInsuredForm()
  {
    const newForm = this.fb.group({
      insured_name: ['', Validators.required],
      insured_address: ['', Validators.required],
      insured_phone_number: ['', Validators.required],
      insured_email: ['', [Validators.required, Validators.email]],
      insured_birth_date: [this.today, Validators.required]
    });
    this.addInsuredForms.push(newForm);
    this.addInsuredButtonClicked = true;
  }

  removeInsuredForm(index: number)
  {
    this.addInsuredForms.splice(index, 1);
    this.addInsuredButtonClicked = false;
  }

  addVehiculeForm()
  {
    const newForm = this.fb.group({
      vehicle_registration_number: ['', Validators.required],
      vehicle_brand: ['', Validators.required],
      vehicle_model: ['', Validators.required],
      vehicle_type: ['', Validators.required],
      vehicle_registration_date: [this.today, Validators.required],
      vehicle_fuel: ['', Validators.required],
      vehicle_gearbox: ['Manual', Validators.required],
      vehicle_color: ['', Validators.required]
    });
    this.addVehiculeForms.push(newForm);
    this.addVehiculeButtonClicked = true;
  }

  removeVehiculeForm(index: number)
  {
    this.addVehiculeForms.splice(index, 1);
    this.addVehiculeButtonClicked = false;
  }

  onSubmitForm()
  {
    if (this.addClaimForm.valid)
    {
      let claim = this.addClaimForm.value;
      let contractData : Contract;
      let insuredData : Insured;
      let vehicleData : Vehicle;

      if(this.addContractButtonClicked)
      {
        contractData = this.addContractForms[0].value;
      
        if(this.addInsuredButtonClicked)
        {
          //test si ça exist
          insuredData = this.addInsuredForms[0].value;
          
          this.insuredService.addInsured(insuredData).subscribe(
            () => contractData.insured_name = insuredData.insured_name,
            error => console.error('Error adding insured', error)
          );
        }
        else if(this.addVehiculeButtonClicked)
        {
          vehicleData = this.addVehiculeForms[0].value;
          
          this.vehicleService.addVehicle(vehicleData).subscribe(
            () => contractData.vehicle_registration_number = vehicleData.vehicle_registration_number,
            error => console.error('Error adding vehicle', error)
          );
        }
        else
        {
          this.contractService.addContract(contractData).subscribe(
            () => {
              claim.contract_number = contractData.contract_number;

              this.claimService.addClaim(claim).subscribe(
                () => {
                  alert('Claim added successfully!');
                  this.onResetForm();
                  this.router.navigate(['/claims']);
                },
                error => {
                  console.error('Error adding claim', error);
                }
              );
            },
            error => console.error('Error adding contract', error)
          );
        }
      }
      else
      {
        this.claimService.addClaim(claim).subscribe(
          () => {
            alert('Claim added successfully!');
            this.onResetForm();
            this.router.navigate(['/claims']);
          },
          error => {
            console.error('Error adding claim', error);
          }
        );
      }
    }
    else
    {
      alert('Please check form !');
    }
  }

  onResetForm()
  {
    this.addClaimForm.reset();
  }

  revenir(): void
  {
    this.router.navigate(['/claims']);
  }
}