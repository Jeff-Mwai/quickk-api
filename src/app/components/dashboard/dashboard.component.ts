import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MoneyTransferService } from 'src/app/services/money-transfer.service';
import { ActivatedRoute } from '@angular/router';
import { userDetails } from 'src/app/models/trasfer-details';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

cashForm: FormGroup | any;
showForm = false;
userDetails: userDetails | any;
allTopUps: userDetails[] = [];
totalAmount : any;
topUpPayload = {
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
    this.getAllTopUps();
    // console.log('', this.allTopUps);
    
    // this.getAmount();
    this.cashForm = this._formBuilder.group({
      phone_number: ['', Validators.required],
      amount: ['', Validators.required],

    })
  }


  getCurrentUser() {
    this._authService.getCurrentUser().then(user => {
      if (user) {
        console.log('Current user:', user.providerData);
      } else {
        console.log('User not logged in.');
      }
    });
  }

  displayForm() {
    this.showForm = true
  }

  sendMoney() {

  }

  // getAmount(): void {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (id) {
  //     this._transferService.getTopUpAmount(id).subscribe((data) => {
  //       console.log('data', data);
        
  //       this.userDetails = data;
  //     });
  //   }
  // }

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
      console.log('allTopUps', this.allTopUps);
      this.totalAmount = this.allTopUps.reduce((acc, item) => {
        return acc + item.amount;
      }, 0);
      
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
    this.topUpPayload.phone_number = phone_number
    this.topUpPayload.amount = amount
    console.log('topUpPayload', this.topUpPayload);
    

  
    this._transferService.topUp(this.topUpPayload);
    alert('successful');

    this.resetForm();

  }

  resetForm() {
   this.cashForm.value.phone_number = ''
    this.cashForm.value.amount = ''
  }


}
