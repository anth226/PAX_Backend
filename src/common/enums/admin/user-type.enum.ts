export enum AdminUserTypeEnum {
  SuperAdmin = "SuperAdmin",
  UPPERDIVISIONASSISTANT = "UDA",
  ADDITIONALDIRECTOR = "AD",
  DEPUTYPROJECTDIRECTOR = "DPD",
  PROJECTDIRECTOR = "PD",
}

const adminUserTypeSerial = Object.values(AdminUserTypeEnum);

export function adminUserSerialize(adminUserTypes: AdminUserTypeEnum[]) {
  const userList = [];
  adminUserTypeSerial.forEach((user) => {
    if (adminUserTypes.includes(user)) {
      userList.push(user);
    }
  });
  return userList;
}
