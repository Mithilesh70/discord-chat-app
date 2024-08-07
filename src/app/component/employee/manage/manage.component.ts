import { Component, OnInit, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlsOf } from '../../../shared/facades/typed-form';
import {
  EmployeeAdd,
  EmployeeAddRes,
  EmployeeList,
} from '../../../shared/facades/employee';
import { ValidationService } from '../../../core/service/validation.service';
import { ApiService } from '../../../core/service/api.service';
import { ApiResponse } from '../../../shared/facades/api-response';
import { CoreService } from '../../../core/service/core.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NumberOnlyDirective } from '../../../shared/directives/number-only.directive';
import { AlphaNumericDirective } from '../../../shared/directives/alpha-numeric.directive';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NumberOnlyDirective,
    AlphaNumericDirective,
  ],
  templateUrl: './manage.component.html',
})
export default class ManageComponent implements OnInit {
  employeeId = input(null, { alias: 'id' });
  employeeDetailRes = input<ApiResponse<EmployeeList> | undefined>(undefined, {
    alias: 'employeeDetail',
  });

  employeeForm!: FormGroup<ControlsOf<EmployeeAdd>>;
  isSubmitted = false;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private coreService: CoreService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.initializeProductForm();
    if (this.employeeId()) {
      this.patchForm(this.employeeDetailRes()?.data);
    }
  }

  manageEmployee(): void {
    this.isSubmitted = true;
    if (this.employeeForm.invalid) {
      return;
    }
    const { name, age, salary } = this.employeeForm.getRawValue();
    const payload = {
      name,
      age: Number(age),
      salary: Number(salary),
    };

    const apiUrl = this.employeeId() ? `update/${this.employeeId()}` : 'create';
    const apiResponse = this.employeeId()
      ? this.apiService.put<ApiResponse<EmployeeAddRes>>(apiUrl, payload)
      : this.apiService.post<ApiResponse<EmployeeAddRes>>(apiUrl, payload);

    apiResponse.subscribe({
      next: (res: ApiResponse<EmployeeAddRes>) => {
        let message = '';
        if (res.status === 'success') {
          message = this.employeeId()
            ? 'Employee updated successfully!'
            : 'Employee added successfully!';
        } else {
          message = 'Something went wrong, Please try again later.';
        }

        this.coreService.showToast(
          res.status === 'success' ? 'success' : 'error',
          res.message || message
        );

        this.coreService.navigateTo(['../'], {
          relativeTo: this.route,
        });
      },
    });
  }

  private initializeProductForm(): void {
    this.employeeForm = this.fb.group<ControlsOf<EmployeeAdd>>({
      name: this.fb.nonNullable.control('', [ValidationService.required]),
      age: this.fb.nonNullable.control('', [ValidationService.required]),
      salary: this.fb.nonNullable.control('', [ValidationService.required]),
    });
  }

  private patchForm(employeeDetails: EmployeeList | undefined) {
    if (employeeDetails) {
      const {
        employee_name: name,
        employee_age: age,
        employee_salary: salary,
      } = employeeDetails;

      this.employeeForm.patchValue({
        name,
        age,
        salary,
      });
    }
  }
}
