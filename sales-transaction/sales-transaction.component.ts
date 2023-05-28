import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/Interface/CustomerInterface';
import { Product } from 'src/app/Interface/ProductInterface';
import { SalesTransaction } from 'src/app/Interface/SalesTransaction';
import { CustomerService } from 'src/app/Service/CustomerService';
import { InvoiceService } from 'src/app/Service/InvoiceService';
import { ProductService } from 'src/app/Service/ProductService';
import { SalesTransactionService } from 'src/app/Service/SalesTransactionService';
import { InvoiceComponent } from '../invoice/invoice.component';
import { Invoice } from 'src/app/Interface/InvoiceInterface';

interface TransactionIds {
  transactionIds: number[];
}

@Component({
  selector: 'app-sales-transaction',
  templateUrl: './sales-transaction.component.html',
  styleUrls: ['./sales-transaction.component.css'],
})
export class SalesTransactionComponent implements OnInit {
  salesTransactionFormGroup: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private _transactionService: SalesTransactionService,
    private _customerService: CustomerService,
    private _productSevice: ProductService,
    private _invoiceService: InvoiceService,
    private dialog: MatDialog
  ) {
    this.salesTransactionFormGroup = this._formBuilder.group({
      customerId: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }

  transaction$!: Observable<SalesTransaction[]>;
  customer$!: Observable<Customer[]>;
  Product$!: Observable<Product[]>;
  Invoice$!:Observable<Invoice[]>

  displayedColumns: string[] = [
    'Select',
    'Id',
    'Created At',
    'Customer Name',
    'Product Name',
    'Product Price',
    'Quantity',
    'Total Amount',
    'Invoice Generated',
    'Actions',
  ];

  transaction!: SalesTransaction;
  isEditing: boolean = false;

  isTransactionSelected: boolean = false;

  selectedIds: TransactionIds = {
    transactionIds: [],
  };

  ngOnInit(): void {
    this.loadTransactionData();
    this.customer$ = this._customerService.getAllCustomer();
    this.Product$ = this._productSevice.getAllProduct();
  }

  loadTransactionData() {
    this.transaction$ = this._transactionService.getAllSalesTransaction();
  }

  onSubmit() {
    var transaction: SalesTransaction =
      this.salesTransactionFormGroup.getRawValue();
    this._transactionService.addSalesTransaction(transaction).subscribe({
      next: (result: boolean) => {
        if (result) {
          alert('transaction added successfully');
          this.salesTransactionFormGroup.reset();
          this.loadTransactionData();
        }
      },
      error: (error: any) => {
        alert(error.error);
      },
    });
  }

  onEditPressed(transaction: SalesTransaction) {
    this.isEditing = true;
    this.transaction = transaction;
    this.salesTransactionFormGroup.patchValue(transaction);
  }

  onUpdate() {
    var transaction: SalesTransaction =
      this.salesTransactionFormGroup.getRawValue();
    transaction.id = this.transaction.id;
    this._transactionService.UpdateSalesTransaction(transaction).subscribe({
      next: (result: boolean) => {
        if (result) {
          alert('product Updated successfully');
          this.salesTransactionFormGroup.reset();
          this.loadTransactionData();
        }
      },
      error: (error: any) => {
        alert(error.error);
      },
    });
  }

  onUpdateCancel() {
    this.isEditing = false;
    this.salesTransactionFormGroup.reset();
  }

  onDelete = (Id: string) => {
    const confirmed = confirm('Do You Want to delete ?');

    if (confirmed) {
      this._transactionService.deleteSalesTransaction(Number(Id)).subscribe({
        next: (result: boolean) => {
          if (result) {
            alert('product deleted successfully');
            this.loadTransactionData();
          }
        },
        error: (error: any) => {
          alert(error.error);
        },
      });
    }
  };

  onSelect(id: number) {
    if (this.selectedIds.transactionIds.includes(id)) {
      this.selectedIds.transactionIds.splice(
        this.selectedIds.transactionIds.indexOf(id),
        1
      );
    } else {
      this.selectedIds.transactionIds.push(id);
    }

    this.isTransactionSelected = this.selectedIds.transactionIds.length !== 0;
  }

  openInvoiceDialog(invoice: Invoice[]): void {
    const dialogRef = this.dialog.open(InvoiceComponent, {
      data: invoice
    });
    
  }
  

  onInvoiceGenerate() {

     this._invoiceService.generateInvoice(this.selectedIds).subscribe({
      next: (invoice:Invoice[]) =>{
        this.openInvoiceDialog(invoice);
        this.loadTransactionData();
      },
      error : (err:any) =>{
        alert(err.error);
      }
    })
  }
}
