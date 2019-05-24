import { Action } from '@ngrx/store';

import * as AuthActions from '../actions/auth.actions';
import { User } from '../models/user.model';

export interface State {
    isAuthenticated: boolean;
    userData: User;
}

const initialState: State = {
    isAuthenticated: false,
    userData: null,
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
    switch (action.type) {
        case AuthActions.SET_AUTHENTICATED:
            return {...state, isAuthenticated: true, userData: action.payload };
        case AuthActions.UNSET_AUTHENTICATED:
            return {...state, isAuthenticated: false, userData: null };
        default:
            return state;
    }
}

export const getIsAuthenticated = (state: State) => state.isAuthenticated;
export const getUserData = (state: State) => state.userData;
