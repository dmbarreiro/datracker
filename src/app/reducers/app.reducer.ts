import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUi from './ui.reducer';
import * as fromAuth from './auth.reducer';

export interface State {
    ui: fromUi.State;
    auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
    ui: fromUi.uiReducer,
    auth: fromAuth.authReducer,
};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
// getIsLoading gets the State returned by getUiState and applies fromUi.getIsLoading function
// which returns isLoading variable.
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuthenticated = createSelector(getAuthState, fromAuth.getIsAuthenticated);
export const getUserData = createSelector(getAuthState, fromAuth.getUserData);
