import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { StopTrainingComponent } from './stop-training.component';
import { Exercise } from 'src/app/models/exercise.model';
import { TrainingService } from '../training.service';
import * as fromTraining from '../../reducers/training.reducer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  trainingProgress = 0;
  timer: number;
  exercise$: Observable<Exercise>;
  private subs = new SubSink();
  private timeLeft: number = null; // Tracks the time left in case we pause timer.
  repetition: string | number;

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>,
  ) {}

  ngOnInit() {
    this.startResumeTimer();
  }

  startResumeTimer() {
    // Careful here, we use window (global browser) method setInterval()
    // not sure what will happen to this if we use server-side-rendering
    this.exercise$ = this.store.select(fromTraining.getActiveExercise).pipe(take(1));
    this.subs.add(
      this.exercise$.subscribe((currentEx: Exercise) => {
        if (currentEx != null) {
          let expected: number;
          if (this.timeLeft != null) {
            // Resuming timer
            expected = Date.now() + this.timeLeft;
          } else {
            // Starting timer from the beginning
            expected = Date.now() + (currentEx.duration * 1000);
          }
          const step = (currentEx.duration / 100) * 1000; // Percentage
          const stepRepetition = (currentEx.duration / currentEx.repetitions) * 1000;
          expected += 3 * stepRepetition;
          // this.repetition = currentEx.repetitions;
          // timer function
          const timerCheck = () => {
            this.timeLeft = expected - Date.now();
            if (this.timeLeft > (currentEx.duration * 1000)) { // Countdown
              const countdown = this.timeLeft - (currentEx.duration * 1000);
              if (countdown > (2 * stepRepetition)) {
                this.repetition = 'Ready';
              } else if (countdown > stepRepetition) {
                this.repetition = 'Steady';
              } else {
                this.repetition = 'Go!';
              }
              this.timer = window.setTimeout(timerCheck, step);
            } else { // Exercise start
              this.repetition = Math.ceil(this.timeLeft / stepRepetition);
              this.trainingProgress = Math.round(((currentEx.duration - (this.timeLeft / 1000)) / currentEx.duration) * 100);
              if (this.trainingProgress >= 100 || this.timeLeft < 0) {
                this.trainingService.completeExercise();
              } else {
                if (this.timeLeft > step) {
                  this.timer = window.setTimeout(timerCheck, step);
                } else if (this.timeLeft < step && this.timeLeft > 0) {
                  this.timer = window.setTimeout(timerCheck, this.timeLeft);
                }
              }
            }
          };
          // Kick-off timer
          this.timer = window.setTimeout(timerCheck, step);
        }
      }),
    );
  }

  onCancel() {
    clearTimeout(this.timer);
    const stopDialogRef = this.dialog.open(StopTrainingComponent, { data: {
      progress: this.trainingProgress
    }});
    stopDialogRef.afterClosed().subscribe(stopTraining => {
      this.timeLeft = null;
      if (stopTraining) {
        this.trainingService.stopExercise(this.trainingProgress);
      } else {
        this.startResumeTimer();
      }
    });
  }

  ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.subs.unsubscribe();
  }

}
