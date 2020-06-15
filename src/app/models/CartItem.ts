export class CartItem {
    constructor(
        public amount?:number,
        public id?:Number, /* reference to the chosen product ID*/
        public cartId?:Number
        
    ){}
}