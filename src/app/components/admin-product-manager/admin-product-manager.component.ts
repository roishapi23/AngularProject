import { Product } from './../../models/productDetails';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { UploadService } from 'src/app/services/upload.service';
import { log } from 'util';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admin-product-manager',
  templateUrl: './admin-product-manager.component.html',
  styleUrls: ['./admin-product-manager.component.css']
})
export class AdminProductManagerComponent implements OnInit {
  
  public product:Product;/* product to update */
  public afterUpdateMessage:string;
  public newProduct:Product;/* product to add */
  public categorysArray = [{name:"Meat&Fish", numberId:"1"},{name:"Milk&Eggs", numberId:"2"},{name:"Vegtabels&Fruits", numberId:"3"},{name:"Wine&Drinks", numberId:"4"}]

  /* pointer to fileUpload element */
  @ViewChild("fileUpload", { static: false })
  fileUpload: ElementRef;
  public files = [];
  public fileName;
  public uploadedImageName;

  activatedRoute: ActivatedRoute;

  constructor(public productsService: ProductsService, public usersService: UsersService , private uploadService: UploadService, private router:Router , private route: ActivatedRoute) {
    this.productsService = productsService;
    this.product = new Product(); 
    this.newProduct = new Product();
   }

  ngOnInit() {

    // check if user is admin
    let observable = this.usersService.checkIfUserIsAdmin();
    observable.subscribe(answer => {
      console.log(answer.message)
      
    },error =>{
      console.log(error)
      if (error.status == 607) {
        this.router.navigate(['home'], {relativeTo: this.activatedRoute})
        
      }
      if (error.status == 608) {
        this.router.navigate(['home'], {relativeTo: this.activatedRoute})
        console.log("No accses allwoed")
      }
    })
  }

  public updateProduct(){
    // set the object that we will send to server - with the chosen product values
    this.product.id = this.productsService.adminCurrentChosenProduct.id;
    this.product.productName = this.productsService.adminCurrentChosenProduct.productName;
    this.product.price = this.productsService.adminCurrentChosenProduct.price;
    // this.product.image = this.productsService.adminCurrentChosenProduct.image;
    let chosenCategory = this.productsService.adminCurrentChosenProduct.categoryId;
    /* transform chosen category to category id number */
    let chosenCategoryId = this.getCategoryNumber(chosenCategory)
    console.log(chosenCategoryId)
    this.product.categoryId = chosenCategoryId; /* set category id number at the object that is about to send */
    console.log("product to update is : " + JSON.stringify(this.product))
    this.sendUpdateRequest(); /* send request to server */
  }
  // take category name and return it's id
  public getCategoryNumber(category){
    for (let index = 0; index < this.categorysArray.length; index++) {
      if (category == this.categorysArray[index].name) {
        return this.categorysArray[index].numberId;
      }
    }
  }

  public sendUpdateRequest(){
    let observable = this.productsService.updateProduct(this.product);
    console.log("sended product is "+JSON.stringify(this.product))
    observable.subscribe(updateApproval =>{
      this.productsService.updatedProssesOver = true; /* for display succses message */
      this.afterUpdateMessage = "Product has been updated";
      // delete product from ui if his category has been changed
      if (this.productsService.productCategoryBeforeUpdate != this.product.categoryId) {
        for (let index = 0; index < this.productsService.products.length; index++) {
          if (this.productsService.products[index].id == this.product.id) {
            this.productsService.products.splice(index,1)
            return;
          }
        } 
      }
      else{ /* if product on the same category as ui - update its image */
        if (this.product.image != null) { /* only if picture actually changed */
          for (let index = 0; index < this.productsService.products.length; index++) {
            if (this.productsService.products[index].id == this.product.id) {
              this.productsService.products[index].image = this.product.image;
              return;
            }
          } 
        }
      }
    },error =>{
      
      this.afterUpdateMessage = "Product update failed"

    })
  }

  public displayNewproductArea(){
    this.initAddProductInputs();
    this.productsService.openedNewProductArea = true;
    this.productsService.updatedProssesOver = false;
    
  }
  // empty form
  public initAddProductInputs(){
    this.newProduct.productName = "";
    this.newProduct.price = null;
    this.newProduct.image = null;
  }

  public addNewProduct(newProductImgName){
    console.log(this.newProduct)
    this.newProduct.image = newProductImgName;
    console.log(this.newProduct)

    let observable = this.productsService.addNewProduct(this.newProduct);
    observable.subscribe(newProductInfo =>{
      // display succsess message
      this.productsService.updatedProssesOver = true;
      this.afterUpdateMessage = "Product has been added";
      console.log("new prosuct is "+newProductInfo)

      // take current displayed category
      let currentCategory = this.route.snapshot.paramMap.get('category');
      console.log("current categoty is"+currentCategory)
      // run on all the categorys
        for (let index = 0; index < this.categorysArray.length; index++) {
          // compare the current displayed category to the category array - to get current category id
          if (this.categorysArray[index].name == currentCategory) {
            // if the new product is from the same category thet displayed - show new product
            if (this.categorysArray[index].numberId == newProductInfo.categoryId) {
              this.productsService.products.push(newProductInfo);
              return;
            }
          }
      }
    },error =>{
      console.log(error)
     alert("Failed to add product")
    })
    
  }

  //---------------------- upload image --------------------

  onClick() {
    // Clearing the files from previous upload
     this.files = [];
     // Extracting a reference to the DOM element named #fileUpload
     const fileUpload = this.fileUpload.nativeElement; 
     fileUpload.onchange = () => {
       for (let index = 0; index < fileUpload.files.length; index++) {
         const file = fileUpload.files[index];
         console.log(file);
     this.files.push({ name: file.name, data: file, inProgress: false,     progress: 0 });
        this.fileName=this.files[index].name
       }};
     fileUpload.click();
 }
  
  uploadFiles() {
    console.log(this.newProduct)
    this.fileUpload.nativeElement.value = '';
  //chacking that the user add a file to update
    if(this.files.length!==0){ /* if a file have been chosen - continue upload file */
      this.files.forEach(file => {
        console.log("enterd to with picture")
        this.uploadFile(file);
      });
    }
    if (this.files.length == 0) { /* if no file has been chosen - dont upload - just update without file */
      if (this.productsService.openedNewProductArea == true) {
        alert("Please choose a picture to the new product")
        return;
      }
      console.log("enterd the witout picture area ")
      this.updateProduct(); 
    }
  }

  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    this.uploadService.upload(formData)
      .subscribe((event: any) => {
        let productImageNewName = event.body;
        console.log(event.body)
        if (event.body != undefined) {
          if (this.productsService.openedNewProductArea == true) {
            this.addNewProduct(productImageNewName);
          }
          else{
            this.product.image = productImageNewName
            this.updateProduct();
          }
        }
        if (typeof (event) === 'object') {
        }
      });
  }
}
