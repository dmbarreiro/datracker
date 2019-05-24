import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { SubSink } from 'subsink';

import { TrainingService } from '../training.service';
import { Exercise } from 'src/app/models/exercise.model';
import * as fromTraining from '../../reducers/training.reducer';
import * as fromApp from '../../reducers/app.reducer';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;
  @ViewChild('tagtraining') training: MatSelect;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>,
  ) {}

  ngOnInit() {
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.isLoading$ = this.store.select(fromApp.getIsLoading);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchExercises();
  }

  onStartTraining(exerciseId: string) {
    if (exerciseId) {
      this.trainingService.startExercise(exerciseId);
    }
  }

}
