import { Action } from '@ngrx/store';

import { Exercise } from '../models/exercise.model';

export const SET_AVAILABLE_EXERCISES = '[Training] Set Available Exercises';
export const SET_FINISHED_EXERCISES = '[Training] Set Finished Exercises';
export const SET_ACTIVE_TRAINING = '[Training] Set Active Training';
export const UNSET_ACTIVE_TRAINING = '[Training] Unset Active Training';

export class SetAvailableExercises implements Action {
    readonly type = SET_AVAILABLE_EXERCISES;

    constructor(public payload: Exercise[]) {}
}

export class SetFinishedExercises implements Action {
    readonly type = SET_FINISHED_EXERCISES;

    constructor(public payload: Exercise[]) {}
}

export class SetActiveTraining implements Action {
    readonly type = SET_ACTIVE_TRAINING;

    constructor(public payload: string) {}
}

export class UnsetActiveTraining implements Action {
    readonly type = UNSET_ACTIVE_TRAINING;
}

export type TrainingActions = SetAvailableExercises | SetFinishedExercises | SetActiveTraining | UnsetActiveTraining;
