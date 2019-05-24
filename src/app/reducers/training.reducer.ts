import { createFeatureSelector, createSelector } from '@ngrx/store';


import * as TrainingActions from '../actions/training.actions';
import * as fromApp from '../reducers/app.reducer';
import { Exercise } from '../models/exercise.model';

export interface TrainingState {
    availableExercises: Exercise[];
    finishedExercises: Exercise[];
    activeExercise: Exercise;
}

export interface State extends fromApp.State {
    training: TrainingState;
}

const initialState: TrainingState = {
    availableExercises: [],
    finishedExercises: [],
    activeExercise: null,
};

export function trainingReducer(state = initialState, action: TrainingActions.TrainingActions) {
    switch (action.type) {
        case TrainingActions.SET_AVAILABLE_EXERCISES:
            return {
                ...state,
                availableExercises: action.payload
            };
        case TrainingActions.SET_FINISHED_EXERCISES:
            return {
                ...state,
                finishedExercises: action.payload
            };
        case TrainingActions.SET_ACTIVE_TRAINING:
            const selectedTraining = [...(state.availableExercises)].find((ex: Exercise) => ex.id === action.payload);
            if (selectedTraining !== undefined) {
                return {
                    ...state,
                    activeExercise: selectedTraining,
                };
            } else {
                return {
                    ...state,
                };
            }
        case TrainingActions.UNSET_ACTIVE_TRAINING:
            return {
                ...state,
                activeExercise: null
            };
        default:
            return state;
    }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');
export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveExercise = createSelector(getTrainingState, (state: TrainingState) => state.activeExercise);
export const getIsTrainingActive = createSelector(getTrainingState, (state: TrainingState) => state.activeExercise != null);
