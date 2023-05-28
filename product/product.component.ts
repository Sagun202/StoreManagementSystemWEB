import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from 'src/app/Interface/ProductInterface';
import { ProductService } from 'src/app/Service/ProductService';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productFormGroup!:FormGroup ;
  constructor(private _formBuilder:FormBuilder, private _productService:ProductService) {

    this.productFormGroup = this._formBuilder.group({
      name: ['',Validators.required],
      price:['',Validators.required]
    })
  }

  Products$!:Observable<Product[]>
  displayedColumns: string[] = ["Id",'Name', 'Price', 'Created At', 'Actions'];

  product!:Product;
  isEditing:boolean = false;

  ngOnInit(): void {
   this.loadProductData()
  }

  loadProductData(){
    this.Products$ = this._productService.getAllProduct();
  }

  onSubmit(){
   var customer:Product = this.productFormGroup.getRawValue();
  this._productService.addProduct(customer).subscribe({
    next: (result:boolean) => {
      if (result) {
        alert("Product added successfully");
        this.productFormGroup.reset();
        this.loadProductData();
      }
    },
    error: (error:any) => {
      alert(error.error);
    },
   
  });
  }

  onEditPressed(product:Product){
    this.isEditing = true;
    this.product = product;
    this.productFormGroup.patchValue(product);
  }

  onUpdate(){
    var product:Product = this.productFormGroup.getRawValue();
    product.id = this.product.id;
    this._productService.UpdateProduct(product).subscribe({
      next: (result:boolean) => {
        if (result) {
          alert("product Updated successfully");
          this.productFormGroup.reset();
          this.loadProductData();
        }
      },
      error: (error:any) => {
        alert(error.error);
      }
    });
  }

  onUpdateCancel(){
    this.isEditing = false;
    this.productFormGroup.reset();
  }
  
  onDelete =(Id:string) =>{
    const confirmed = confirm("Do You Want to delete ?");

    if(confirmed){
      this._productService.deleteProduct(Number(Id)).subscribe({
        next: (result:boolean) => {
          if (result) {
            alert("product deleted successfully");
            this.loadProductData();
          }
        },
        error: (error:any) => {
          alert(error.error);
        }
      });
    }
  }

}
