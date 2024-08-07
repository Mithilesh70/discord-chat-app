import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  input,
} from '@angular/core';
import { EmployeeList } from '../../../shared/facades/employee';
import { CurrencyPipe } from '@angular/common';
import { APP_CONSTANT } from '../../../app-constant';
import { RouterLink } from '@angular/router';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ConfirmationComponent } from '../../../shared/ui-component/confirmation/confirmation.component';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/service/api.service';
import { ApiResponse } from '../../../shared/facades/api-response';
import { CoreService } from '../../../core/service/core.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './list.component.html',
})
export default class ListComponent implements OnInit, OnDestroy {
  allEmployee!: EmployeeList[];
  allEmployeeCopy!: EmployeeList[];

  currency = APP_CONSTANT.currency;
  noImageUrl = APP_CONSTANT.noImageUrl;
  noDataImageUrl = APP_CONSTANT.noDataImageUrl;

  dialogRef!: DialogRef<any, any>;
  subscription: Subscription[] = [];
  constructor(
    private dialog: Dialog,
    private apiService: ApiService,
    private coreService: CoreService
  ) {
    effect(() => {
      if (this.coreService.updateState()?.event === 'employeeSearch') {
        this.allEmployee = this.allEmployeeCopy.filter((employee) =>
          employee.employee_name
            .toLowerCase()
            .includes(this.coreService.updateState()?.value.toLowerCase())
        );

        this.allEmployee = JSON.parse(JSON.stringify(this.allEmployee));
      }
    });
  }
  ngOnDestroy(): void {
    this.dialogRef?.close();
    this.subscription?.forEach((item) => item?.unsubscribe());
  }
  ngOnInit(): void {
    this.getList();
  }

  deleteEmployee(id: string, name: string) {
    this.dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        confirmationTitle: 'Remove Employee?',
        confirmationMessage: `Do you want to remove ${name}?`,
      },
    });
    this.subscription.push(
      this.dialogRef.closed.subscribe((value) => {
        if (value) {
          this.apiService.delete<ApiResponse>(`delete/${id}`).subscribe({
            next: (res: ApiResponse) => {
              this.coreService.showToast('success', res.message);
              this.getList();
            },
          });
        }
      })
    );
  }

  private getList() {
    this.coreService.updateState.set({
      event: 'employeeSearch',
      value: '',
    });
    this.apiService.get<ApiResponse<EmployeeList[]>>('employees').subscribe({
      next: (res: ApiResponse<EmployeeList[]>) => {
        this.allEmployee = res.data;
        this.allEmployeeCopy = JSON.parse(JSON.stringify(this.allEmployee));
      },
    });
  }
}
