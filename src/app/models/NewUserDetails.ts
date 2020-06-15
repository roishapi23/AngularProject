export class NewUserDetails {
    constructor(
        public idNumber:String,
        public email:String,
        public password:String,
        public confirmPassword:String,
        public city?:String,
        public street?:String,
        public name?:String,
        public familyName?:String,
    ){}
}