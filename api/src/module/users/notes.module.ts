import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NoteEntity } from "src/common/entity/users/admin/note.entity";
import { NoteController } from "./controller/note.controller";
import { NotesService } from "./services/notes.service";


@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity])],
  controllers: [NoteController],
  providers: [NotesService ],
})
export class NotesModule {}
