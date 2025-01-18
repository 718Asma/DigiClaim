export class Contract
{
    constructor(
        public contract_number: string,
        public contract_start_date: Date,
        public contract_end_date: Date,
        public insured_name: string,
        public vehicle_registration_number: string
    ){}
}
