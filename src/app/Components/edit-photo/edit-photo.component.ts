import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from '../../Services/photo.service';
import { Photo } from '../../Classes/photo';
import { ClaimService } from '../../Services/claim.service';
import { Claim } from '../../Classes/claim';

@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.css']
})

export class EditPhotoComponent implements OnInit
{
  editForm!: FormGroup;

  id: string = '';
  photo: Photo | undefined;

  Claim: Claim[] = [];
  claim: Claim | undefined;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private photoService: PhotoService,
    private claimService: ClaimService,
    private activatedRoute: ActivatedRoute
  ){
    this.editForm = this.fb.group({
      photo_name: ['', Validators.required],
      photo_date: ['', Validators.required],
      claim_number: ['', Validators.required]
    });
  }

  ngOnInit(): void
  {
    this.id = this.activatedRoute.snapshot.params['id'];
  
    this.claimService.getClaims().subscribe(
      (data: Claim[]) => {
        this.Claim = data;
  
        this.photoService.getPhotos().subscribe(
          photos => {
            this.photo = photos.find(photo => photo.photo_id === this.id);
  
            if (!this.photo)
            {
              console.error('Photo not found');
            }
            else
            {
              this.claim = this.Claim.find(c => c.claim_number === this.photo?.claim_number);
              const photo_date = new Date(this.photo?.photo_date).toISOString().split('T')[0]
  
              this.editForm = this.fb.group({
                photo_name: [this.photo?.photo_name, Validators.required],
                photo_date: [photo_date, Validators.required],
                claim_number: [this.claim?.claim_number, Validators.required]
              });
            }
          },
          error => {
            console.error('Error fetching photo', error);
          }
        );
      },
      error => {
        console.error('Error fetching claim numbers', error);
      }
    );
  }
  

  onSubmitForm()
  {
    if (this.editForm.valid && this.photo && this.claim)
    {
      const photo = this.editForm.value as Photo;
      console.log(photo);

      this.photoService.updatePhoto(this.photo.photo_id, photo).subscribe(
        photo => {
          alert('Photo updated successfully!');
          this.router.navigate(['/claims', this.claim?.claim_number, 'photo', this.claim?.claim_number]);
        },
        error => {
          console.error('Error updating Photo', error);
        }
      );
    }
    else
    {
      alert('Please check the form!');
    }
  }
  

  onResetForm()
  {
    this.editForm.reset();
  }

  revenir(): void
  {
    this.router.navigate(['/claims', this.claim?.claim_number, 'photo', this.claim?.claim_number]);
  }
}
