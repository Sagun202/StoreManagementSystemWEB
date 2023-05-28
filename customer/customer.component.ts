import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Customer } from 'src/app/Interface/CustomerInterface';
import { CustomerService } from 'src/app/Service/CustomerService';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerFormGroup:FormGroup ;
  constructor(private _formBuilder: FormBuilder,private _customerService:CustomerService ) {
    this.customerFormGroup  = this._formBuilder.group({
      name:['',Validators.required],
      phone:['',Validators.required]
    });
  }

  customerData$!:Observable<Customer[]>
  displayedColumns: string[] = ["Id",'Name', 'Phone', 'Created At', 'Actions'];


  isEdit : boolean = false;
  customer!:Customer;

  ngOnInit ():void {
    this.loadCustomerData();  
  }

  loadCustomerData(){
    this.customerData$ = this._customerService.getAllCustomer();
  }

  onEditPressed(customer:Customer){
    this.customerFormGroup.patchValue(customer);
    this.customer = customer;
    this.isEdit = !this.isEdit;
  }


  onUpdate(){
    var customer:Customer = this.customerFormGroup.getRawValue();
    customer.phone = customer.phone.toString();
    customer.id = this.customer.id;
    this._customerService.UpdateCustomer(customer).subscribe({
      next: (result:boolean) => {
        if (result) {
          alert("Customer Updated successfully");
          this.customerFormGroup.reset();
          this.loadCustomerData();
        }
      },
      error: (error:any) => {
        alert(error.error);
      }
    });
  }

  onUpdateCancel(){
    this.isEdit = !this.isEdit;
    this.customerFormGroup.reset();
  }

  onSubmit(){
    var customer:Customer = this.customerFormGroup.getRawValue();
   customer.phone = customer.phone.toString();
  this._customerService.addCustomer(customer).subscribe({
    next: (result:boolean) => {
      if (result) {
        alert("Customer added successfully");
        this.customerFormGroup.reset();
        this.loadCustomerData();
      }
    },
    error: (error:any) => {
      alert(error.error);
    }
  });
  }

  onDelete =(Id:string) =>{
    const confirmed = confirm("Do You Want to delete ?");

    if(confirmed){
      this._customerService.deleteCustomer(Number(Id)).subscribe({
        next: (result:boolean) => {
          if (result) {
            alert("Customer deleted successfully");
            this.ngOnInit();
          }
        },
        error: (error:any) => {
          alert(error.error);
        }
      });
    }
  }

}
