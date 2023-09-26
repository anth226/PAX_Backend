import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Response,
  StreamableFile,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { I18nValidationExceptionFilter } from "nestjs-i18n";
import { PayloadResponseDTO } from "src/common/dto/payload-response.dto";
import { NoteListDto } from "../dto/note-list.dto";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { CreateNoteDto } from "../dto/create-notes.dto";
import { NotesService } from "../services/notes.service";
import { DtoValidationPipe } from "src/common/pipes/dtoValidation.pipe";
import { NoteIdParamDto } from "../dto/note-param.dto";
import { UpdateNoteDto } from "../dto/update-note.dto";

@Controller("v1/admin/note")
@ApiTags("Note")
export class NoteController {
  constructor(
    private readonly notesService: NotesService,
  ) {}
  /**************************************************Fetch All Data**************************************************/
  @Get()
  @ApiResponse({ description: "Get All Data", status: HttpStatus.OK })
  async find_all(
    @Query() noteListDto: NoteListDto,
    @Pagination() paginationDto: PaginationDto
  ) {
    const [expected_data, total] = await this.notesService.find_all(
      noteListDto,
      paginationDto
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: "All Data Fetched",
      metadata: {
        page: paginationDto.page,
        totalCount: total,
        limit: paginationDto.limit,
      },
      data: expected_data,
    });
  }

  /****************************************************Insert Data****************************************************/
  @Post()
  @UseFilters(new I18nValidationExceptionFilter())
  @ApiResponse({ description: "Insert Data", status: HttpStatus.CREATED })
  @ApiBody({ type: CreateNoteDto })
  async create(
    @Body(new DtoValidationPipe())
    createNoteDto: CreateNoteDto,

  ) {
    const expected_data = await this.notesService.create(
      createNoteDto,

    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.CREATED,
      message: "Data Entry Successfully",
      data: expected_data,
    });
  }

   /*************************************************Fetch Single Data*************************************************/
   @Get(":id")
   @ApiResponse({ description: "Single Data Fetched", status: HttpStatus.OK })
   async find_one(
     @Param(new DtoValidationPipe()) params: NoteIdParamDto,
   ) {
     const expected_data = await this.notesService.find_one(
       params.id,
     );
     return new PayloadResponseDTO({
       statusCode: HttpStatus.OK,
       message: "Single Data Fetched",
       data: expected_data,
     });
   }
 

  /*************************************************Update Single Data*************************************************/
  @Put(":id")
  @ApiResponse({ description: "Single Data Updated", status: HttpStatus.OK })
  async update(
    @Param(new DtoValidationPipe()) params: NoteIdParamDto,
    @Body(new DtoValidationPipe()) updateNoteDto: UpdateNoteDto,
  ) {
    const expected_data = await this.notesService.update(
      params.id,
      updateNoteDto,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: "Data Updated Successfully",
      data: expected_data,
    });
  }


  /**********************************************Hard Delete Single Data***********************************************/
  @Delete("/delete/:id")
  @ApiResponse({
    description: "Data Hard Deleted Successfully",
    status: HttpStatus.OK,
  })
  async finalDelete(
    @Param(new DtoValidationPipe()) params: NoteIdParamDto,
  ) {
    await this.notesService.final_delete(params.id);

    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: "Data Hard Deleted Successfully",
      data: {},
    });
  }

}
