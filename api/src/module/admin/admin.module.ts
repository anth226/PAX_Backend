import { Module } from "@nestjs/common";
import { NotesModule } from "../users/notes.module";


export const NoteModuleList = [
  NotesModule,
];
@Module({
  imports: NoteModuleList,
  controllers: [],
})
export class AdminModule {}
