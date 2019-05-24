import { Action } from '@ngrx/store';
import { User } from '../models/user.model';

export const SET_AUTHENTICATED = '[Auth] Set Authenticated';
export const UNSET_AUTHENTICATED = '[Auth] Unset Authenticated';

export class SetAuthenticated implements Action {
    readonly type = SET_AUTHENTICATED;

    constructor(public payload: User) {}
}

export class UnsetAuthenticated implements Action {
    readonly type = UNSET_AUTHENTICATED;
}

export type AuthActions = SetAuthenticated | UnsetAuthenticated;
