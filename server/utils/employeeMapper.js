export function mapEmployeeFromDB(employee) {
  if (!employee) return null;
//use age of undefined to prevent null values in frontend
  return {
    _id: employee.id,
    id: employee.id,

    employeeId: employee.employee_id ?? undefined,
    name: employee.name ?? undefined,
    email: employee.email ?? undefined,
    department: employee.department ?? undefined,
    birthday: employee.birthday ?? undefined,
    avatar: employee.avatar ?? undefined,
    role: employee.role ?? undefined,

    resetCode: employee.reset_code ?? undefined,
    resetCodeExpiry: employee.reset_code_expiry ?? undefined,

    createdAt: employee.created_at ?? undefined,
    updatedAt: employee.updated_at ?? undefined,};
}

export function mapEmployeesFromDB(employees = []) {
  return employees.map(mapEmployeeFromDB);
}
