import { PurchasesService } from './../../services/purchases.service';
import { ShippingDetails } from './../../models/ShippingDetails';
import { Component, OnInit } from '@angular/core';
import { CartsService } from 'src/app/services/carts.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment'; 
import * as jsPDF from 'jspdf'; /* need to install jspdf*/
import 'jspdf-autotable'; 

@Component({
  selector: 'app-shipping-details',
  templateUrl: './shipping-details.component.html',
  styleUrls: ['./shipping-details.component.css']
})
export class ShippingDetailsComponent implements OnInit {
  public customerShippingDetails: ShippingDetails;
  public userDetails:Object;
  public isDateAvailable = true;
  public resarvationNumber = 0;
  activatedRoute: ActivatedRoute;
  /* make the user not possible to choose past dates */
  minDate = moment(new Date()).format('YYYY-MM-DD'); 

  public pdfItems = [];
  public footer ;
  

  constructor(public purchaseService:PurchasesService , public cartsService:CartsService , private router:Router , private route: ActivatedRoute) {
    this.customerShippingDetails = new ShippingDetails();
   }

  ngOnInit() {
    this.purchaseService.isPurchaseCompleted = false;
  }

  public pay(){
    this.isDateAvailable = true;
    console.log(this.customerShippingDetails);
    let observable = this.purchaseService.setThePurchase(this.customerShippingDetails)
    observable.subscribe(purchaseResponse =>{
      console.log(purchaseResponse)
      this.purchaseService.isPurchaseCompleted = true;
      this.resarvationNumber = purchaseResponse.resarvationNumber
      
    }, error => {
      console.log(error)
      if (error.status == 604) {
        this.isDateAvailable = false;
        // date 14/07/20 is fully booked - try to order at this date and you will get an error
      }
    })
  }
  public fillDetails(){
    // making sure that if input has something writen in it - the request wont happend
    // and that way the request happend only on the first time the user click on the input
    if (this.customerShippingDetails.city !=null || this.customerShippingDetails.street!=null ) {
      console.log("entterd")
      return;
    }
    let observable = this.purchaseService.getCustomerShippingAddress();
    observable.subscribe(customerAddress =>{
      // get user address and display it
      console.log(customerAddress.city)
      console.log(customerAddress.street)
      this.customerShippingDetails.city = customerAddress.city;
      this.customerShippingDetails.street = customerAddress.street;

    }, error => {
      if (error.status == 404) {
        alert(error.error.error)
        }
    })
  }

  public navToHomePage(){
    this.cartsService.cartItemsList = [];
    this.cartsService.cartTotalPrice = 0;
    this.router.navigate(['home/customer'], {relativeTo: this.activatedRoute})
  }



   // -------------------------------------------
  head = [['no.', 'Item', 'Amount', 'Price']]
 

  data = this.pdfItems;

  
  public createPdf() {
    this.setCartItemsForPDF()
    var doc = new jsPDF();
 
    doc.setFontSize(18);
    doc.text('Purchase details - resarvation Number: '+this.resarvationNumber , 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);
 
 
    (doc as any).autoTable({
      head: this.head,
      body: this.data,
      foot: this.footer,
      theme: 'grid',
      didDrawCell: data => {
        console.log(data.column.index)
      }
    })
 
    // Open PDF document in new tab
    // doc.output('dataurlnewwindow')
 
    // Download PDF document  
    doc.save('CartRecipt (no.'+this.resarvationNumber+').pdf');
    this.pdfItems = [];
  }

  public setCartItemsForPDF(){
    let counter = 1;
    for (let index = 0; index < this.cartsService.cartItemsList.length; index++) {
      let item = [counter , this.cartsService.cartItemsList[index].productName , this.cartsService.cartItemsList[index].amount , "ILS "+this.cartsService.cartItemsList[index].totalPrice]
      this.pdfItems.push(item);
      counter++
    }
    this.footer = [["","Total price:" , "ILS "+ this.cartsService.cartTotalPrice,"" ]]

  }

 

}
