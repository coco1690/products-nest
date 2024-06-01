import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interface';
import { User } from 'src/auth/entities/user.entity';
import { GetUserDecorators } from '../auth/decorators/get-user.decorator';

@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.user)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUserDecorators() user:User// GetUserDecorators viene del modulo de AUth y trae el Usuario"user"
    ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth(ValidRoles.superUser)
  findAll( @Query() PaginationDto: PaginationDto) {
    return this.productsService.findAll( PaginationDto );
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  } 

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUserDecorators() user:User
    ) {
    return this.productsService.update( id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
