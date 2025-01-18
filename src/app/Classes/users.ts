export class Users
{
    constructor(
        public user_id: string,
        public user_firstname: string,
        public user_lastname: string,
        public user_email: string,
        public user_phone_number: string,
        public user_password: string,
        public user_role: string
    ){}
}