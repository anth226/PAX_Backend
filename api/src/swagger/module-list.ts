import { AdminModule, AdminModuleList } from "src/module/admin/admin.module";
import { PublicModuleList } from "src/module/public/public.module";

const ModuleList = [
  {
    url: "/admin",
    Module: AdminModuleList,
  },

  // Website Api Will be avilable here
  {
    url: "/public",
    Module: PublicModuleList,
  },
];
export default ModuleList;
