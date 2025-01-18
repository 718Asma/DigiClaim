export class Claim
{
    constructor(
        public claim_number: string,                
        public accident_date: Date,
        public creation_date: Date,              
        public status: string,                      
        public contract_number: string
    ){}
}
