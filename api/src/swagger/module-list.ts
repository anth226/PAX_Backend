import { AdminModule, NoteModuleList,  } from "src/module/admin/admin.module";
import { PublicModuleList } from "src/module/public/public.module";

const ModuleList = [
  {
    url: "/note",
    Module: NoteModuleList,
  },

  // Website Api Will be avilable here
  {
    url: "/public",
    Module: PublicModuleList,
  },
];
export default ModuleList;
