import { LmsModuleList } from "../module/lms/lms.module";
import { PublicModuleList } from "src/module/public/public.module";

const ModuleList = [
  {
    url: "/lms",
    Module: LmsModuleList,
  },

  // Website Api Will be avilable here
  {
    url: "/public",
    Module: PublicModuleList,
  },
];
export default ModuleList;
