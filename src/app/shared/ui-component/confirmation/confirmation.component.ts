import { Component, Inject } from '@angular/core';

import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
@Component({
  selector: 'app-verse-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent {
  constructor(
    @Inject(DIALOG_DATA)
    public data: {
      confirmationTitle: string;
      confirmationMessage: string;
      confirmButtons?: { text: string; value: any; class: string }[];
    },
    public dialogRef: DialogRef
  ) {
    if (data && !data.confirmButtons?.length) {
      this.data['confirmButtons'] = [
        {
          text: 'Yes',
          value: true,
          class: 'btn   btn-primary rounded-5 px-4 ',
        },
        {
          text: 'No',
          value: false,
          class: 'btn  btn-secondary rounded-5 px-4',
        },
      ];
    }
  }

  close(value: string) {
    this.dialogRef?.close(value);
  }
}
