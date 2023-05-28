import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Invoice } from 'src/app/Interface/InvoiceInterface';
import { InvoiceService } from 'src/app/Service/InvoiceService';
import { InvoiceComponent } from '../invoice/invoice.component';

@Component({
  selector: 'app-all-invoice',
  templateUrl: './all-invoice.component.html',
  styleUrls: ['./all-invoice.component.css']
})
export class AllInvoiceComponent implements OnInit {

  /**
   *
   */
  constructor(private _invoiceService:InvoiceService,  private dialog: MatDialog) {  
  }

  invoices$!:Observable<Invoice[]>

  ngOnInit(): void {
    this.invoices$ = this._invoiceService.getAllinvoice();
  }

  displayedColumns: string[] = [
    
    'Invoice Id',
    'Customer Id',
    'Customer Name',
    'Products',
    'Invoice Total',
    'View',

  ]; 

  viewInvoice(invoice:Invoice){
    var invoices:Invoice[] = [];
    invoices.push(invoice);
    this.openInvoiceDialog(invoices);
  }

  
  openInvoiceDialog(invoice: Invoice[]): void {
    const dialogRef = this.dialog.open(InvoiceComponent, {
      data: invoice
    });
    
  }
}
