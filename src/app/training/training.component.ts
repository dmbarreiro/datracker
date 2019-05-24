import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromTraining from '../reducers/training.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  trainingOn$: Observable<boolean>;

  constructor(
    private store: Store<fromTraining.State>,
  ) {}

  ngOnInit() {
    this.trainingOn$ = this.store.select(fromTraining.getIsTrainingActive);
  }

}
