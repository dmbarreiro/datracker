import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../../reducers/app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenavEvent = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.State>,
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromApp.getIsAuthenticated);
  }

  closeSidenav() {
    this.closeSidenavEvent.emit();
  }

  onLogout() {
    this.closeSidenav();
    this.authService.logout();
  }
}
