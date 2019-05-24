import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../../reducers/app.reducer';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidenavEvent = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(
    private store: Store<fromApp.State>,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromApp.getIsAuthenticated);
  }

  onLogout() {
    this.authService.logout();
  }

  onSidenavToggle() {
    this.toggleSidenavEvent.emit();
  }

}
