import { ProductsService } from 'src/app/services/products.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  activatedRoute: ActivatedRoute;
  public searchInput = "";
  

  constructor( public productsService: ProductsService ,private router:Router , private route: ActivatedRoute) {
  
  }

  ngOnInit() {
  }

  public searchProduct(){
    if(this.searchInput == ""){
      alert("please write the product you are looking for");
      return;
    }
    if(this.router.url === '/shop/Search'){
      // alert("workssss")
      this.productsService.userSearchInput = this.searchInput;
      sessionStorage.setItem("search" , this.searchInput);
      location.reload();
      
    // this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
    // this.router.navigate(['Your actualComponent']);
    // });

      return;
    }
    sessionStorage.setItem("search" , this.searchInput);
    this.productsService.userSearchInput = this.searchInput;
    console.log(this.searchInput)
    this.router.navigate(['shop/Search'], {relativeTo: this.activatedRoute});
    this.searchInput = "";
  }
  public milkAndEggs(){
    this.router.navigate(['shop/Milk&Eggs'], {relativeTo: this.activatedRoute})
  }
  public vegtabelsAndFruits(){
    this.router.navigate(['shop/Vegtabels&Fruits'], {relativeTo: this.activatedRoute})
  }
  public meatAndFish(){
    this.router.navigate(['shop/Meat&Fish'], {relativeTo: this.activatedRoute})
  }
  public wineAndDrinks(){
    this.router.navigate(['shop/Wine&Drinks'], {relativeTo: this.activatedRoute})
  }

}
