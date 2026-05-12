export function mapEmployeeToDB(body = {}) {
  const data = {};

  if (body.employeeId !== undefined) data.employee_id = body.employeeId;
  if (body.name !== undefined) data.name = body.name;
  if (body.email !== undefined) data.email = body.email;
  if (body.password !== undefined) data.password = body.password;
  if (body.department !== undefined) data.department = body.department;
  if (body.birthday !== undefined) data.birthday = body.birthday;
  if (body.avatar !== undefined) data.avatar = body.avatar;
  if (body.role !== undefined) data.role = body.role;
  if (body.resetCode !== undefined) data.reset_code = body.resetCode;
  if (body.resetCodeExpiry !== undefined) data.reset_code_expiry = body.resetCodeExpiry;

  return data;
}
