import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private sidenavSubject$: BehaviorSubject<boolean>;
  sidenavChanged$: Observable<boolean>;
  private sidenavOpen: boolean;

  constructor() {
    this.sidenavOpen = false;
    this.sidenavSubject$ = new BehaviorSubject(this.sidenavOpen);
    this.sidenavChanged$ = this.sidenavSubject$.asObservable();
  }

  isSidenavOpen() {
    return this.sidenavOpen;
  }

  closeSidenav() {
    if (this.sidenavOpen) {
      this.sidenavOpen = false;
      this.sidenavSubject$.next(this.sidenavOpen);
    }
  }

  openSidenav() {
    if (!this.sidenavOpen) {
      this.sidenavOpen = true;
      this.sidenavSubject$.next(this.sidenavOpen);
    }
  }

  // Subject messages when sidenav state changes. Maybe in the future we want to create
  // different subjects for notifying about opening and closing events.
  toggleSidenav() {
    this.sidenavOpen ? this.sidenavOpen = false : this.sidenavOpen = true;
    this.sidenavSubject$.next(this.sidenavOpen);
  }
}
