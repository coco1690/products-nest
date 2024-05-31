import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { v4 as uuid } from 'uuid';






@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor( 'file'))

  
  uploadProductsFiles( 
    @UploadedFile(
      new ParseFilePipeBuilder()
      .addFileTypeValidator({
        
        fileType: /(jpg|jpeg|png)$/,  
        
        
      })
      .build({
        
        // exceptionFactory: error =>{ return new BadRequestException('el archivo es requerido')},
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      })

    )
    file: Express.Multer.File
    ){
      const fileExtension = file.mimetype.split('/')[1];
      const fileName = `${uuid()}.${fileExtension}`

      console.log({ nameFile: fileName});
      return { originalName: fileName }
    }

}
