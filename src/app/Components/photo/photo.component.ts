import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from '../../Services/photo.service';
import { Photo } from '../../Classes/photo';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})

export class PhotoComponent implements OnInit
{
  id: string = '';
  photos: Photo[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void
  {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.fetchPhotos();
  }

  fetchPhotos(): void
  {
    this.photoService.getPhotos().subscribe(
      photos => {
        this.photos = photos.filter(photo => photo.claim_number === this.id);
        this.photos.forEach(elt => {
          elt.photo_name = elt.photo_name.split('.')[0];
          elt.photo = '../../../assets/' + elt.photo.split('\\').pop();
        });
      },
      error => {
        console.error('Error fetching photos', error);
      }
    );
  }

  onFileChange(event: any): void
  {
    const file = event.target.files[0];
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png'))
    {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('photo_name', fileName);
      formData.append('photo_date', new Date().toISOString());
      formData.append('claim_number', this.id);

      this.photoService.uploadPhoto(formData).subscribe(
        response => {
          console.log('Upload successful:', response);
          this.fetchPhotos();
        },
        error => {
          console.error('Upload failed:', error);
        }
      );
    }
    else
    {
      console.log('Invalid file extension');
      alert('Please upload a photo file with .jpg, .jpeg, or .png extension');
    }
    event.target.value = '';
  }

  deletePhoto(photo: Photo): void
  {
    const confirmDelete = window.confirm("Are you sure you want to delete this photo? This action cannot be undone.");
  
    if (confirmDelete)
    {
      this.photoService.deletePhoto(photo.photo_id).subscribe(
        () => {
          this.photos = this.photos.filter(p => p.photo_id !== photo.photo_id);
          this.fetchPhotos();
        },
        error => {
          console.error('Error deleting photo', error);
        }
      );
    }
  }
  
  revenir(): void
  {
    this.router.navigate(['/claims']);
  }
}