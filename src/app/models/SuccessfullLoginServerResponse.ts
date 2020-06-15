export class SuccessfullLoginServerResponse {
    constructor(
        public id:Number,
        public token:string,
        public userType:String,
        public name:String
    ){}
}