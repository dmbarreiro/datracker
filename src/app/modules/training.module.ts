import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { TrainingComponent } from '../training/training.component';
import { CurrentTrainingComponent } from '../training/current-training/current-training.component';
import { NewTrainingComponent } from '../training/new-training/new-training.component';
import { PastTrainingsComponent } from '../training/past-trainings/past-trainings.component';
import { StopTrainingComponent } from '../training/current-training/stop-training.component';
import { SharedModule } from './shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { trainingReducer } from '../reducers/training.reducer';

@NgModule({
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingsComponent,
        StopTrainingComponent,
    ],
    imports: [
        SharedModule,
        TrainingRoutingModule,
        StoreModule.forFeature('training', trainingReducer),
    ],
    exports: [],
    // In entryComponents you add components which are not instantiated by adding
    // a selector in your templates nor by routing.
    entryComponents: [StopTrainingComponent]
})
export class TrainingModule {}
