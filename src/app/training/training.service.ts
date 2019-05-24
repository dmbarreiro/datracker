import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SubSink } from 'subsink';

import { Exercise } from '../models/exercise.model';
import { UiService } from '../services/ui.service';
import * as fromTraining from '../reducers/training.reducer';
import * as fromApp from '../reducers/app.reducer';
import * as Ui from '../actions/ui.actions';
import * as Training from '../actions/training.actions';
import { User } from '../models/user.model';


@Injectable({
    providedIn: 'root'
})
export class TrainingService {
    private subs = new SubSink();
    private user$: Observable<User>;

    constructor(
        private fstore: AngularFirestore,
        private uiService: UiService,
        private store: Store<fromTraining.State>,
    ) {}

    fetchExercises() {
        // We do not need to unsubscribe from observables in services since they are singletons
        // which are on for the whole life of the App.
        // The connection is not a problem either, after we call fetchExercises the connection gets
        // automatically cleaned up by Firebase (or AngularFire, I'm not sure) after the method gets executed
        // so we do not create duplicate connections on every call.
        // this.uiService.loadingStateChanged$.next(true);
        this.store.dispatch(new Ui.StartLoading());
        this.subs.add(
            this.fstore.collection('availableExercises').snapshotChanges().pipe(
                map(docArray => {
                    return docArray.map(doc => {
                        return {
                            id: doc.payload.doc.id,
                            name: doc.payload.doc.data()['name'],
                            duration: doc.payload.doc.data()['duration'],
                            met: doc.payload.doc.data()['met'],
                            repetitions: doc.payload.doc.data()['repetitions'],
                        };
                    });
                })
            ).subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new Training.SetAvailableExercises(exercises));
                this.store.dispatch(new Ui.StopLoading());
            }, err => {
                this.store.dispatch(new Ui.StopLoading());
                const message = 'Fetching training exercises failed';
                const refSnackBar = this.uiService.showSnackBar(message, 'Dismiss', 4000);
                const refSnackBarSub = refSnackBar.onAction().subscribe(() => {
                    refSnackBar.dismiss();
                    refSnackBarSub.unsubscribe();
                });
            })
        );
    }

    fetchFinishedExercises() {
        // This way we send finishedExercises to the DB and then we query those exercises to show them here,
        // maybe it is more efficient to store them offline, that way we save fetching data from server, this is
        // feasible if we do not do differential fetching (only fetching the data we show instead of all available
        // data on server).
        this.user$ = this.store.select(fromApp.getUserData).pipe(take(1));
        this.user$.subscribe(userData => {
            const finishedExSubscription = this.fstore.collection('users').doc(`${userData.uid}`).collection('finishedExercises')
            .valueChanges()
            .subscribe((finishedExercises: Exercise[]) => {
                this.store.dispatch(new Training.SetFinishedExercises(finishedExercises));
            }, err => {
                const message = 'Fetching finished training exercises failed';
                const refSnackBar = this.uiService.showSnackBar(message, 'Dismiss', 4000);
                const refSnackBarSub = refSnackBar.onAction().subscribe(() => {
                    refSnackBar.dismiss();
                    refSnackBarSub.unsubscribe();
                });
            });
            this.subs.add(
                finishedExSubscription
            );
        });
    }

    cancelSubscriptions() {
        this.subs.unsubscribe();
    }

    startExercise(exerciseId: string) {
        this.store.dispatch(new Training.SetActiveTraining(exerciseId));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe(exercise => {
            this.user$.pipe(take(1)).subscribe((user: User) => {
                this.addFinishedExercisesToDb({
                    ...exercise,
                    calories: exercise.met * user.weight * (exercise.duration / 3600),
                    date: new Date(),
                    state: 'completed'});
                this.store.dispatch(new Training.UnsetActiveTraining());
            });
        });
    }

    stopExercise(trainingProgress: number) {
        this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe(exercise => {
            if (trainingProgress > 0) {
                this.user$.pipe(take(1)).subscribe((user: User) => {
                    this.addFinishedExercisesToDb({
                        ...exercise,
                        duration: exercise.duration * (trainingProgress / 100),
                        calories: exercise.met * user.weight * (exercise.duration / 3600) * (trainingProgress / 100),
                        date: new Date(),
                        state: 'cancelled'});
                });
            }
            this.store.dispatch(new Training.UnsetActiveTraining());
        });
    }

    private addFinishedExercisesToDb(exercise: Exercise) {
        // When selecting a collection which does not exist this collection
        // is created.
        this.user$ = this.store.select(fromApp.getUserData).pipe(take(1));
        this.user$.subscribe(userData => {
            this.fstore.collection('users').doc(`${userData.uid}`).collection('finishedExercises').add(exercise)
                .catch(err => {
                    const message = 'There was a problem connecting to the database';
                    const refSnackBar = this.uiService.showSnackBar(message, 'Dismiss', 4000);
                    const refSnackBarSub = refSnackBar.onAction().subscribe(() => {
                        refSnackBar.dismiss();
                        refSnackBarSub.unsubscribe();
                    });
                });
        });
    }
}
