export class Photo
{
    constructor(
        public photo_id: string,
        public photo:string,
        public photo_name: string,
        public photo_date: Date,
        public claim_number: string
    ){}
}
