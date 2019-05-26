import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';

import { AuthData } from '../models/auth-data.model';
import { TrainingService } from '../training/training.service';
import { UiService } from '../services/ui.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../reducers/app.reducer';
import * as Ui from '../actions/ui.actions';
import * as Auth from '../actions/auth.actions';
import * as fromTraining from '../reducers/training.reducer';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private router: Router,
        private fauth: AngularFireAuth,
        private fstore: AngularFirestore,
        private trainingService: TrainingService,
        private uiService: UiService,
        private store: Store<fromTraining.State>,
    ) {}

    initAuthListener() {
        this.fauth.authState.subscribe(user => {// Background observable to authenticate automatically
            if (user) {
                const { email, emailVerified, uid } = user;
                if (emailVerified) {
                    this.fstore.collection('users').doc(`${uid}`).valueChanges().pipe(take(1)).subscribe((userInfo: User) => {
                        const { weight, birthdate } = userInfo;
                        this.store.dispatch(new Auth.SetAuthenticated({ email, uid, weight, birthdate, emailVerified }));
                        this.router.navigate(['/training']);
                    });
                }
            } else {
                this.trainingService.cancelSubscriptions();
                this.store.dispatch(new Auth.UnsetAuthenticated());
                this.router.navigate(['/']);
            }
        });
    }

    async registerUser(authData: AuthData) {
        this.store.dispatch(new Ui.StartLoading());
        try {
            const signup = await this.fauth.auth.createUserWithEmailAndPassword(authData.email, authData.password);
            await this.fauth.auth.currentUser.sendEmailVerification();
            const { uid, email, emailVerified } = signup.user;
            const birthdate = authData.birthdate;
            const weight = authData.weight;
            const result = await this.fstore.collection('users').doc(`${signup.user.uid}`)
                .set({ uid, email, emailVerified, birthdate, weight });
            await this.fauth.auth.signOut();
            this.router.navigate(['/']);
            const refSnackBar = this.uiService
                .showSnackBar('Please verify your e-mail address', 'Dismiss', 4000);
            const snackBarSub = refSnackBar.onAction().subscribe(() => {
                refSnackBar.dismiss();
                snackBarSub.unsubscribe();
            });
            this.store.dispatch(new Ui.StopLoading());
        } catch (err) {
            const refSnackBar = this.uiService.showSnackBar(err.message, 'Dismiss', 4000);
            const snackBarSub = refSnackBar.onAction().subscribe(() => {
                refSnackBar.dismiss();
                snackBarSub.unsubscribe();
            });
            this.store.dispatch(new Ui.StopLoading());
        }
    }

    async login(authData: AuthData) {
        this.store.dispatch(new Ui.StartLoading());
        try {
            const result = await this.fauth.auth.signInWithEmailAndPassword(authData.email, authData.password);
            if (!result.user.emailVerified) {
                let refSnackBar = this.uiService
                    .showSnackBar('Please verify your e-mail address', 'Resend', 8000);
                const snackBarSub = refSnackBar.onAction().subscribe(async () => {
                    try {
                        await this.fauth.auth.currentUser.sendEmailVerification();
                        refSnackBar.dismiss();
                        snackBarSub.unsubscribe();
                    } catch (err) {
                        refSnackBar.dismiss();
                        snackBarSub.unsubscribe();
                        refSnackBar = this.uiService
                            .showSnackBar(err.message, '', 4000);
                    }
                });
            } else {
                this.fstore.collection('users').doc(`${result.user.uid}`).valueChanges()
                    .pipe(take(1)).subscribe((userInfo: User) => {
                        const { email, uid, birthdate, emailVerified, weight } = userInfo;
                        this.store.dispatch(new Auth.SetAuthenticated({ email, uid, weight, birthdate, emailVerified }));
                        if (!emailVerified) {
                            this.fstore.collection('users').doc(`${result.user.uid}`)
                                .set({ email, uid, birthdate, emailVerified: true, weight });
                        }
                        this.router.navigate(['/training']);
                });
            }
            this.store.dispatch(new Ui.StopLoading());
        } catch (err) {
            const refSnackBar = this.uiService.showSnackBar(err.message, 'Dismiss', 4000);
            const snackBarSub = refSnackBar.onAction().subscribe(() => {
                refSnackBar.dismiss();
                snackBarSub.unsubscribe();
            });
            this.store.dispatch(new Ui.StopLoading());
        }
    }

    async logout() {
        try {
            this.trainingService.stopExercise(0);
            await this.fauth.auth.signOut();
            this.store.dispatch(new Auth.UnsetAuthenticated());
        } catch (err) {
            const refSnackBar = this.uiService.showSnackBar(err.message, 'Dismiss', 4000);
            const snackBarSub = refSnackBar.onAction().subscribe(() => {
                refSnackBar.dismiss();
                snackBarSub.unsubscribe();

            });
        }
    }
}
