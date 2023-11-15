import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { userDetails } from '../models/trasfer-details';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MoneyTransferService {

  constructor(private afs: AngularFirestore) { }

  topUp(topUpDetails: userDetails) {
    topUpDetails.id = this.afs.createId()
    return this.afs.collection('top-up-details').add(topUpDetails)
  }

  getTopUpAmount(topUpDetails: userDetails) {
    return this.afs.doc(`top-up-details/`+ topUpDetails.id).valueChanges();
  }

  getAllTopUps() {
    return this.afs.collection('top-up-details').snapshotChanges()
  }

}
