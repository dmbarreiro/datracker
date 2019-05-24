import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    constructor(
        private snackBar: MatSnackBar
    ) {}

    showSnackBar(message: string, action: string, duration: number) {
        return this.snackBar.open(message, action, { duration });
    }
}
