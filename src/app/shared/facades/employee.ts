export interface EmployeeList {
  employee_age: string;
  employee_name: string;
  employee_salary: string;
  id: string;
  profile_image: string;
}

export interface EmployeeAdd {
  name: string;
  salary: string;
  age: string;
}

export interface EmployeeAddRes {
  name: string;
  salary: string;
  age: string;
  id: number;
}
