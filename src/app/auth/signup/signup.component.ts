import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import * as fromApp from '../../reducers/app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  maxDate: Date;
  minDate: Date;
  isLoading$: Observable<boolean>;
  passwordHide = true;

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.State>,
  ) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.minDate = new Date();
    this.minDate.setFullYear(this.maxDate.getFullYear() - 150);
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      birthdate: new FormControl(null, [Validators.required]),
      weight: new FormControl(null, [Validators.required, Validators.min(30)]),
      massUnits: new FormControl(null, [Validators.required]),
      agreement: new FormControl(null, [Validators.required])
    });
    this.isLoading$ = this.store.select(fromApp.getIsLoading);
    // this.subs.add(
    //   this.uiService.loadingStateChanged$.subscribe(isLoading => {
    //     this.isLoading = isLoading;
    //   })
    // );
  }

  onSignup() {
    if (this.signupForm.get('agreement').value) {
      const email = this.signupForm.get('email').value;
      const password = this.signupForm.get('password').value;
      const birthdate: Date = this.signupForm.get('birthdate').value;
      let weight = this.signupForm.get('weight').value;
      if (this.signupForm.get('massUnits').value === 'lbs') {
        weight /= 2.205; // Convert to Kg
      }
      // console.log(`email: ${email}, password: ${password}, birthdate: ${birthdate}`);
      this.authService.registerUser({ email, password, birthdate, weight });
    }
  }

  // ngOnDestroy() {
  //   this.subs.unsubscribe();
  // }

}
