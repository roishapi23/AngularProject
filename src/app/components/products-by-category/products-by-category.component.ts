import { UsersService } from './../../services/users.service';
import { ProductsService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params, RoutesRecognized } from '@angular/router';
import { Product } from 'src/app/models/productDetails';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-products-by-category',
  templateUrl: './products-by-category.component.html',
  styleUrls: ['./products-by-category.component.css']
})
export class ProductsByCategoryComponent implements OnInit {

  public category:string;
  public categorysArray = [{name:"Meat&Fish", numberId:1},{name:"Milk&Eggs", numberId:2},{name:"Vegtabels&Fruits", numberId:3},{name:"Wine&Drinks", numberId:4}]
  public products : Product[];
  public currentClickedProduct: Product; /* pointer to the product the user clicked on */

  public userSearchInput = "";
  public notFoundAnyProduct = false;

  activatedRoute: ActivatedRoute;
  constructor(public usersService:UsersService ,public productsService: ProductsService , private router:Router , private route: ActivatedRoute) {
    this.currentClickedProduct = new Product();
  }

  ngOnInit() {

    if (this.usersService.isUserLoggedIn == false) {
      this.usersService.isUserLoggedIn = true;
    }

    // this.route.params.subscribe(params => console.log("new parmeter is "+JSON.stringify(params)))
    console.log("enterd")
    // this.setCurrentParameter()
    this.category = this.route.snapshot.paramMap.get('category');
    console.log("snapshot is "+this.category);
    // if (this.category == "") {
    //   console.log("enterd all products")
    //   this.getAllProducts();
    //   return
    // }
    if (this.category == "Search") {
      return;
    }

    if (this.checkIfCategoryIsValid(this.category) == false) {
      // navigaite to 404 page
      console.log("not valid")
      this.router.navigate(['**'], {relativeTo: this.activatedRoute})
      return;
    }
    
    this.getProducts(this.category)

  }

  public checkIfCategoryIsValid(category){
    for (let index = 0; index < this.categorysArray.length; index++) {
      if (category == this.categorysArray[index].name) {
        return true;
      }
    }
    return false;
  }
  public getCategoryNumber(category){
    for (let index = 0; index < this.categorysArray.length; index++) {
      if (category == this.categorysArray[index].name) {
        return this.categorysArray[index].numberId;
      }
    }
  }

  public milkAndEggs(){
    this.router.navigate(['admin/Milk&Eggs'], {relativeTo: this.activatedRoute})
    console.log("enterd milk and eggs")
    let currentCategory = "Milk&Eggs"
    // this.route.params.subscribe(params => console.log("new parmeter is "+JSON.stringify(params)))
    this.getProducts(currentCategory)
  }
  public vegtabelsAndFruits(){
    this.router.navigate(['admin/Vegtabels&Fruits'], {relativeTo: this.activatedRoute})
    console.log("enterd Vegtabels&Fruits")
    let currentCategory = "Vegtabels&Fruits"
    this.getProducts(currentCategory)
  }
  public meatAndFish(){
    this.router.navigate(['admin/Meat&Fish'], {relativeTo: this.activatedRoute})
    console.log("enterd Meat&Fish")
    let currentCategory = "Meat&Fish"
    this.getProducts(currentCategory)
  }
  public wineAndDrinks(){
    this.router.navigate(['admin/Wine&Drinks'], {relativeTo: this.activatedRoute})
    console.log("enterd Wine&Drinks")
    let currentCategory = "Wine&Drinks"
    this.getProducts(currentCategory)
  }

  public getProducts(category){

    if (this.notFoundAnyProduct == true) {
      this.notFoundAnyProduct = false
    }

    let categoryNumber = this.getCategoryNumber(category)
    console.log(categoryNumber)

    /* get all category products */
    let observable = this.productsService.getProductsbyCategory(categoryNumber);
    observable.subscribe(categoryProducts =>{
      // console.log(milkAndEggsProducts);
      this.products = categoryProducts; /* set the server response as our products to display */
      this.productsService.products = this.products;
      console.log(this.products)
      // this.currentClickedProduct = milkAndEggsProducts[0]; 
    },error =>{
       console.log(error)
        if (error.status == 500) {
        this.router.navigate(['home'], {relativeTo: this.activatedRoute})
        alert("you can not enter this url, please login for shopping")
        }
        if (error.status == 404) {
        alert(error.error.error)
        }
    })
  }

  public setCurrentClickedProduct(product){
    if (this.productsService.isUrlAtSearch == true) {
        this.productsService.isUrlAtSearch = false;
      }
    // this.newCartItem.amount = 1; /* setting information to the object that we will set */
    this.currentClickedProduct = product
    this.productsService.adminCurrentChosenProduct = this.currentClickedProduct;
    // this.currentClickedProduct = this.productsService.adminCurrentChosenProduct; /* changing the pointer to the product the user clicked on */
    if (this.route.snapshot.paramMap.get('category') != "Search") {
      this.productsService.adminCurrentChosenProduct.categoryId = this.route.snapshot.paramMap.get('category');
      this.productsService.productCategoryBeforeUpdate = this.route.snapshot.paramMap.get('category');

      console.log("chosen product is "+this.productsService.adminCurrentChosenProduct.productName)
      console.log("chosen product is "+JSON.stringify(this.productsService.adminCurrentChosenProduct))
      this.productsService.openedNewProductArea = false; 
      let categoryArray = [{name:"Meat&Fish", numberId:"1"},{name:"Milk&Eggs", numberId:"2"},{name:"Vegtabels&Fruits", numberId:"3"},{name:"Wine&Drinks", numberId:"4"}];
      for (let index = 0; index < categoryArray.length; index++) {
        if (this.productsService.adminCurrentChosenProduct.categoryId == categoryArray[index].name) {
          this.productsService.productCategoryBeforeUpdate = categoryArray[index].numberId;
          this.productsService.productCategoryNameBeforeUpdate = categoryArray[index].name;
          categoryArray.splice(index , 1)
        }
      }
      this.productsService.categorysArrayWithOutChosenProductCategory = categoryArray;
      console.log(this.productsService.categorysArrayWithOutChosenProductCategory)
    }

    if (this.route.snapshot.paramMap.get('category') == "Search") {
      if (this.productsService.isUrlAtSearch == false) {
        this.productsService.isUrlAtSearch = true;
      }
      this.productsService.categorysArrayWithOutChosenProductCategory = this.categorysArray
    }

    if (this.productsService.updatedProssesOver == true) {
      this.productsService.updatedProssesOver = false
    }
  }

  public searchProduct(){
    if(this.userSearchInput == ""){
      alert("please write the product you are looking for");
      return;
    }
    if (this.notFoundAnyProduct == true) {
      this.notFoundAnyProduct = false
    }
    
    this.router.navigate(['admin/Search'], {relativeTo: this.activatedRoute})
    let observable = this.productsService.getAllProducts();
    observable.subscribe(allProducts =>{
      console.log(allProducts)
      this.productsService.products = []
      for (let index = 0; index < allProducts.length; index++) {
        if (allProducts[index].productName.includes(this.userSearchInput)) {
          this.productsService.products.push(allProducts[index]);
        }
      }
      this.userSearchInput = "";
      if (this.productsService.products.length == 0) {
        this.notFoundAnyProduct = true;
      }
    }, error =>{
      console.log(error);
      if(error.status == 404){
        alert(error.error.error)
      }
    })
  }
}
