export class Product {
    constructor(
        public id?: Number,
        public productName?:String,
        public price?:number,
        public totalPrice?:number,
        public image?:string,
        public amount?:number,
        public categoryId?:string
    ){}
}