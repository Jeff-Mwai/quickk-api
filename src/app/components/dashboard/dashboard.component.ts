import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MoneyTransferService } from 'src/app/services/money-transfer.service';
import { ActivatedRoute } from '@angular/router';
import { userDetails } from 'src/app/models/trasfer-details';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

cashForm: FormGroup | any;
transferForm: FormGroup | any;

showForm = false;
disableEdit = false;

userDetails: userDetails | any;
allTopUps: userDetails[] = [];
allTransactions: userDetails[] =[];
totalAmount : any;
receivedAmount : any;
moneySent : any;

phone_number : any;
current_user: string = '';
displayedColumns: string[] = ['one', 'two', 'three'];
// dataSource = ELEMENT_DATA;
transactionsDataSource = new MatTableDataSource<any>();

topUpPayload = {
  user_id: '',
  id: '',
  phone_number: '',
  amount: ''
};

sendMoneyPayload = {
  user_id: '',
  id: '',
  phone_number: '',
  amount: ''
};

constructor(
  private _formBuilder: FormBuilder,
  private _authService: AuthService,
  private _transferService: MoneyTransferService,
  private route: ActivatedRoute
){}

  ngOnInit(): void {
    this.getCurrentUser();
    this.getAllMoneySent();
    this.cashForm = this._formBuilder.group({
      phone_number: ['', Validators.required],
      amount: ['', Validators.required],

    })

    this.transferForm = this._formBuilder.group({
      phone_number: ['', Validators.required],
      amount: ['', Validators.required],

    })
  }


  getCurrentUser() {
    this._authService.user$.subscribe(user => {
      if (user) {
        this.current_user = user.uid
        console.log('Current user:', this.current_user);
      } else {
        console.log('User not logged in.');
      }
    });
  }

  displayForm() {
    this.showForm = true
  }

  sendMoney() {
    const phone_number = this.transferForm.value.phone_number;
    const amount = this.transferForm.value.amount;
    console.log('phone_number', phone_number);
    

    if (phone_number === '') {
      alert('Enter Phone Number');
    }
  
    if (amount === '') {
      alert('Enter Amount');
    }


    this.sendMoneyPayload.id = ''
    this.sendMoneyPayload.user_id = this.current_user
    this.sendMoneyPayload.phone_number = phone_number
    this.sendMoneyPayload.amount = amount
    console.log('sendMoneyPayload', this.sendMoneyPayload);
    

    if (amount > this.totalAmount) {
      alert('You do not have enough money in your account! Kindly Top Up');
    } else{
      
        this._transferService.sendMoney(this.sendMoneyPayload);
        alert('successful');
    }
    
    this.resetForm();
  }

  getAllMoneySent() {
    this._transferService.getAllMoneySend().subscribe(res => {
      console.log(res);
      
      this.allTransactions = res.map((element: any) => {
        const data = element.payload.doc.data()
        console.log('x',data);
        
        data.id = element.payload.doc;
        console.log('mydata', data.id);
        
        return data
        
      })

      // this.transactionsDataSource.data = this.allTransactions
      const filteredArray = this.allTransactions.filter(item => item.user_id === this.current_user);
      this.transactionsDataSource.data = filteredArray
      // if(filteredArray.length === 0){
      //   console.log('heree now');
      //   this.cashForm.value.phone_number === ''
        
      // }else{
      //   this.phone_number = filteredArray[0]['phone_number']
      //   this.cashForm.patchValue({
      //     phone_number: this.phone_number,
      //   });
      //   this.disableEdit = true
      //   console.log('my phone number is', this.cashForm.value.phone_number);
        
      // }
      console.log('allTransactions', this.allTransactions);
 
      this.moneySent = this.allTransactions.reduce((acc, item) => {
        console.log('item', item);
        
        if (item.user_id === this.current_user) {
          acc += item.amount
        }
        return acc;
      }, 0);

      this.getAllTopUps()
      console.log('Total moneySent:', this.moneySent);
      
    }, err => {
      alert('errrrr')
    })
  }

  getAllTopUps() {
    this._transferService.getAllTopUps().subscribe(res => {
      console.log(res);
      
      this.allTopUps = res.map((element: any) => {
        const data = element.payload.doc.data()
        console.log('x',data);
        
        data.id = element.payload.doc;
        console.log('mydata', data.id);
        
        return data
        
      })

      const filteredArray = this.allTopUps.filter(item => item.user_id === this.current_user);

      if(filteredArray.length === 0){
        console.log('heree now');
        this.cashForm.value.phone_number === ''
        
      }else{
        this.phone_number = filteredArray[0]['phone_number']
        this.cashForm.patchValue({
          phone_number: this.phone_number,
        });
        this.disableEdit = true
        console.log('my phone number is', this.phone_number);
        
      }
      console.log('allTopUps', this.allTopUps);
 
      this.totalAmount = this.allTopUps.reduce((acc, item) => {
        console.log('item', item);
        
        if (item.user_id === this.current_user) {
          acc += item.amount
        }
        return acc;
      }, 0);

      const getPhoneNumber = this.allTransactions.filter(item => item.phone_number === this.phone_number);
      console.log('getPhoneNumber', getPhoneNumber);
      
      // this.transactionsDataSource.data = filteredArray

      this.receivedAmount = getPhoneNumber.reduce((acc, item) => {
        console.log('item', item);
          acc += item.amount
        
        return acc;
      }, 0);
      this.totalAmount = this.totalAmount - this.moneySent
      this.totalAmount = this.totalAmount + this.receivedAmount

      
      console.log('Total Amount:', this.totalAmount);
      
    }, err => {
      alert('errrrr')
    })
  }

  topUp() {
    const phone_number = this.cashForm.value.phone_number;
    const amount = this.cashForm.value.amount;
    console.log('phone_number', phone_number);
    

    if (phone_number === '') {
      alert('Enter Phone Number');
    }
  
    if (amount === '') {
      alert('Enter Amount');
    }

    this.topUpPayload.id = ''
    this.topUpPayload.user_id = this.current_user
    this.topUpPayload.phone_number = phone_number
    this.topUpPayload.amount = amount
    console.log('topUpPayload', this.topUpPayload);
    

  
    this._transferService.topUp(this.topUpPayload);
    alert('successful');

    this.resetForm();

  }

  resetForm() {
    this.cashForm.reset({
      phone_number: '',
      amount: ''
    });

    this.transferForm.reset({
      phone_number: '',
      amount: ''
    });
  }
  


}
