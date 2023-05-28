import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Invoice } from 'src/app/Interface/InvoiceInterface';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Invoice[]) { }

  displayedColumns: string[] = [
    'Product Name',
    'Product Price',
    'Quantity',
    'Total'
  ];


}
