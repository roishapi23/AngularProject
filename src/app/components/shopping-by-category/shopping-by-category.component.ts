import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/productDetails';
import { CartItem } from 'src/app/models/CartItem';
import { CartsService } from 'src/app/services/carts.service';

@Component({
  selector: 'app-shopping-by-category',
  templateUrl: './shopping-by-category.component.html',
  styleUrls: ['./shopping-by-category.component.css']
})
export class ShoppingByCategoryComponent implements OnInit {

  public category:string;
  public categorysArray = [{name:"Meat&Fish", numberId:1},{name:"Milk&Eggs", numberId:2},{name:"Vegtabels&Fruits", numberId:3},{name:"Wine&Drinks", numberId:4}]
  activatedRoute: ActivatedRoute;
  public products : Product[];

  public userSearchInput = "";
  public notFoundAnyProduct = false;

  public currentClickedProduct: Product; /* pointer to the product the user clicked on */
  public newCartItem : CartItem;

  constructor(public productsService: ProductsService, private cartsService : CartsService , private router:Router , private route: ActivatedRoute) {
    this.currentClickedProduct = {id:0 , productName:"" , price: 0, image:""}; /* init pointer */
    this.newCartItem = new CartItem();
    this.cartsService = cartsService;
   }

  ngOnInit() {
    console.log("enterd")

    this.category = this.route.snapshot.paramMap.get('category');
    console.log("snapshot is "+this.category);

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
    this.router.navigate(['shop/Milk&Eggs'], {relativeTo: this.activatedRoute})
    console.log("enterd milk and eggs")
    let currentCategory = "Milk&Eggs"
  
    this.getProducts(currentCategory)
  }
  public vegtabelsAndFruits(){
    this.router.navigate(['shop/Vegtabels&Fruits'], {relativeTo: this.activatedRoute})
    console.log("enterd Vegtabels&Fruits")
    let currentCategory = "Vegtabels&Fruits"
    this.getProducts(currentCategory)
  }
  public meatAndFish(){
    this.router.navigate(['shop/Meat&Fish'], {relativeTo: this.activatedRoute})
    console.log("enterd Meat&Fish")
    let currentCategory = "Meat&Fish"
    this.getProducts(currentCategory)
  }
  public wineAndDrinks(){
    this.router.navigate(['shop/Wine&Drinks'], {relativeTo: this.activatedRoute})
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
  
      this.products = categoryProducts; /* set the server response as our products to display */
      this.productsService.products = this.products;
      console.log(this.products)
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

  public getAllProducts(){
    let observable = this.productsService.getAllProducts();
    observable.subscribe(allProducts =>{
      this.products = allProducts; /* set the server response as our products to display */
      console.log(this.products)
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

  public setCurrentClickedProduct(clickedProduct){
    this.newCartItem.amount = 1; /* setting information to the object that we will set */
    this.currentClickedProduct = clickedProduct; /* changing the pointer to the product the user clicked on */
  }

  // ----------------------shopping part -------------------------

  public setNewCartItem(productId){
    this.newCartItem.id = productId;
    this.currentClickedProduct.amount = this.newCartItem.amount;
    let cartItem = this.newCartItem
    console.log("current cart item : "+ JSON.stringify(cartItem))
    // if product already in cart - update, if not in cart - add
    if(this.checkIfProductExistInCart(cartItem)==true){
      console.log("updating")
      this.updateCartItemAmount(cartItem)
      return
    }
    console.log("adding")
    this.addCartItemToCart(cartItem)
    return;
  }

  public initProductAmount(){
    this.newCartItem.amount = 1;
  }

  public checkIfProductExistInCart(newCartItem){
    let currentCartItemList = this.cartsService.cartItemsList;
    for (let index = 0; index < currentCartItemList.length; index++) {
      if (currentCartItemList[index].id == newCartItem.id) {
        return true;  
      }
    }
    return false
  }

  public updateCartItemAmount(cartItem){
    let observable = this.cartsService.updateCartItem(cartItem); /* send the new cartItem information */
    observable.subscribe(updatedPriceStatus =>{
    let chosenProduct = this.currentClickedProduct; /* setting clicked product as new var */
    let currentCartItemList = this.cartsService.cartItemsList;
    for (let index = 0; index < currentCartItemList.length; index++) {
      if (currentCartItemList[index].id == cartItem.id) {
        currentCartItemList[index].totalPrice = updatedPriceStatus.cartItemUpdatedPrice;
        currentCartItemList[index].amount = chosenProduct.amount;
        this.cartsService.cartItemsList = currentCartItemList
        let updatedTotalCartPrice = updatedPriceStatus.cartUpdatedPrice;
        this.cartsService.cartTotalPrice = updatedTotalCartPrice
      }
      
    }
    },error =>{
      alert("error at updating product")
    })
    this.initProductAmount();

  }

  public addCartItemToCart(cartItem){
    let observable = this.cartsService.addNewCartItem(cartItem); /* send the new cartItem information */
    observable.subscribe(cartPriceStatus =>{
      // console.log(cartPriceStatus);
      // this.currentClickedProduct.price = cartPriceStatus.cartItemUpdatedPrice;
      let chosenProduct = this.currentClickedProduct; /* setting clicked product as new var */
      chosenProduct.totalPrice = cartPriceStatus.cartItemUpdatedPrice; /* set his total price */
      let currentCartItemList = this.cartsService.cartItemsList;
      console.log("current cart items is " + JSON.stringify(currentCartItemList))
      currentCartItemList.push(chosenProduct);
      console.log("cart items after add is : " + JSON.stringify(currentCartItemList));
      this.cartsService.cartItemsList = currentCartItemList;
      let updatedTotalCartPrice = cartPriceStatus.cartUpdatedPrice;
      this.cartsService.cartTotalPrice = updatedTotalCartPrice
    },error =>{
      alert("error at updating product")
    })
    this.initProductAmount();
  }

  // ----------------------------- search--------------------------

  public searchProduct(){
    if(this.userSearchInput == ""){
      alert("please write the product you are looking for");
      return;
    }
    if (this.notFoundAnyProduct == true) {
      this.notFoundAnyProduct = false
    }
    
    this.router.navigate(['shop/Search'], {relativeTo: this.activatedRoute})
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
