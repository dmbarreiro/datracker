import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-stop-training',
    template: `
               <h1 mat-dialog-title>You interrupted the exercise</h1>
               <div mat-dialog-content>
                 <p>You got {{ receivedData.progress }}% done.</p>
                 <p>If you stop this exercise will be saved as cancelled in your log.</p>
                 <p>If you restart only the new attempt will be saved.</p>
               </div>
               <div mat-dialog-actions>
                 <button mat-button [mat-dialog-close]="false"  color="primary">Restart</button>
                 <button mat-button [mat-dialog-close]="true" color="warn">Stop</button>
               </div>
    `
})
export class StopTrainingComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public receivedData: { progress: number }) {}
}
