import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    CanLoad,
    Route
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import * as fromApp from '../reducers/app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(
        private store: Store<fromApp.State>,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select(fromApp.getIsAuthenticated).pipe(
            // Observable is an on-going operator, it emits values continuously but canActivate
            // and canLoad just need one final value, that's why we have to limit out observable
            // to the first value received with take(1).
            take(1)
        );
    }

    canLoad(route: Route) {
        return this.store.select(fromApp.getIsAuthenticated).pipe(
            take(1)
        );
    }
}
