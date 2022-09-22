import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SimpleChange } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { map, Observable, reduce } from 'rxjs';
import { Account } from 'src/app/models/account';
import { Transaction } from 'src/app/models/transaction';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  txnAmount: FormControl = new FormControl(['']);
  txnDescription: FormControl = new FormControl(['']);
  accountId: string = '';
  txnType: FormControl = new FormControl(['']);
  userAccount!: Account;

  accountName: FormControl = new FormControl(['']);
  balance: FormControl = new FormControl(['']);
  accountDescription: FormControl = new FormControl(['']);

  transactionsExists: boolean = false;
  createFormOpen: boolean = false;
  accountMessage: string = '';

  balanceStyle = {};

  transactions: Transaction[] = [];


  constructor(private accountService: AccountService) {
    this.accountId = localStorage.getItem('current-account') || '';
  }

  ngOnInit(): void {
    this.getAllTransactions();
    this.getAccount();
  }

  // ngOnChanges(changes:SimpleChange){
  //   this.getAccount() 
  // }

  addTransaction(amount: number, description: string, type: string) {
    const txn = new Transaction(0, amount, description, type);
    this.accountService.createTransaction(this.accountId, txn).subscribe({
      next: () => {
        this.accountMessage = 'New transaction was saved!';
      },
      error: () => {
        this.accountMessage = 'New transaction was not saved...';
      },
      complete: () => {
        this.getAccount();
        this.getAllTransactions();
      }
    });
  }

  openCreateForm() {
    this.createFormOpen = true;
  }

  getAllTransactions() {
    this.accountService.getTransactions(this.accountId).subscribe({
      next: (resp) => {
        this.transactions = resp;
      },
      error: () => {
        this.accountMessage = 'No transactions were retrieved...';
      },
      complete: () => {
        this.transactions.forEach((txn) => {
          const num = txn.amount;
          txn.amount = +num.toFixed(2);
        });
        this.transactions.reverse();
      }
    }
    );
  }

  getAccount() {
    this.accountService.getAccount(this.accountId).subscribe({
      next: (response) => {
        console.log(localStorage.getItem("current-account"));
        console.log(response);
        this.userAccount = response;
        console.log(this.userAccount);
      },
      error: () => {
        this.accountMessage = "No account was found, please create one!"
      },
      complete: () => {
        this.accountMessage = "Account was successfully retrieved from the database.";
        const num = this.userAccount.balance;
        this.userAccount.balance = +num.toFixed(2);


        if (num < 0) {
          this.balanceStyle = {
            color: '#ff0000'
          }
        } else {
          this.balanceStyle = {
            color: '#5dff5d'
          }
        }


        this.accountName.setValue(this.userAccount.name);
        console.log(this.accountName.status);
        this.balance.setValue(this.userAccount.balance);
        console.log(this.balance.status);
        this.accountDescription.setValue(this.userAccount.description);
        console.log(this.accountDescription.status);

        // if (!localStorage.getItem('foo')) { 
        //   localStorage.setItem('foo', 'no reload') 
        //   location.reload() 
        // } else {
        //   localStorage.removeItem('foo') 
      
        // }
      }
    });
  }

}
