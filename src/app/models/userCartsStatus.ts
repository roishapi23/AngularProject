export class UserCartsStatus {
    constructor(
        public status:String,
        public lastCartDate?:any,
        public cartId?:number,
        public cart?:[],
        public cartPrice?:number
    ){}
}