import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Store } from '@ngrx/store';

import { SubSink } from 'subsink';

import { TrainingService } from '../training.service';
import { Exercise } from 'src/app/models/exercise.model';
import * as fromTraining from '../../reducers/training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'calories', 'duration', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private subs = new SubSink();

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>,
  ) {}

  ngOnInit() {
    this.trainingService.fetchFinishedExercises();
    this.subs.add(
      this.store.select(fromTraining.getFinishedExercises).subscribe(finishedExs => {
        this.dataSource.data = finishedExs;
      }),
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    // Angular searches by row and each row is flattened and set to lowercase,
    // that's why we set our filter value to lowercase as well. We can override this
    // angular default behavior, check angular material filtering documentation.
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
