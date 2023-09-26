import { Body, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { NoteEntity } from "src/common/entity/users/admin/note.entity";
import { Repository } from "typeorm";
import { CreateNoteDto } from "../dto/create-notes.dto";
import { CustomException } from "src/common/exceptions/customException";
import { NoteListDto } from "../dto/note-list.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { UpdateNoteDto } from "../dto/update-note.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
  ) {}

  /**************************************************Fetch All Data**************************************************/
  async find_all(
    noteListDto: NoteListDto,
    paginationDto: PaginationDto
  ): Promise<[NoteEntity[], number]> {
  
    const data = await this.noteRepository.find({
      order: { created_at: "DESC" },
      skip: paginationDto.skip,
      take: paginationDto.limit,
    });
    const total = await this.noteRepository.count({
    });
    return [data, total];
  }

 /****************************************************Insert Data****************************************************/
 async create(
  createNoteDto: CreateNoteDto,
) {
  try {
    const { name,email,message } =
    createNoteDto;
  
    const created_data = await this.noteRepository.save({
      name,
      email,
      message,
    });
    return created_data;
  } catch (error) {
    throw new CustomException(error);
  }
}

 /*************************************************Update Single Data*************************************************/
 async update(
  id: string,
  updateNoteDto: UpdateNoteDto,
) {
  try {
    const find_about_us = await this.noteRepository.findOne({
      where: {
        id: id,
   
      },
    });

  
    await this.noteRepository.update(
      {
        id: id,
      },
      {
        name: updateNoteDto.name,
        email: updateNoteDto.email,
        message: updateNoteDto.message,
  
      }
    );
    const updated_data = await this.noteRepository.findOne({
      where: {
        id: id,
      },
    });
    return updated_data;
  } catch (error) {
    throw new CustomException(error);
  }
}

  /*************************************************Fetch Single Data*************************************************/
  async find_one(id: string) {
    try {
      const expectedData = await this.noteRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!expectedData) {
        throw new NotFoundException(
          "Not Found"
        );
      }
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }


  /**********************************************Hard Delete Single Data***********************************************/

  async final_delete(id: string) {
    try {
      const find_existing = await this.noteRepository.find({
        where: { id },
        withDeleted: true,
      });

      if (!find_existing) {
        throw new NotFoundException(
         "Not Found"
        );
      }
      await this.noteRepository.delete(id);
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }


}
