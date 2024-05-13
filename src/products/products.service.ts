import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from "uuid"; // 1.yarn add uuid  2.yarn add -D @types/uuid





@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

constructor(

  @InjectRepository( Product )
  private readonly productRepository: Repository<Product>

) {}
  

  // CREO EL PRODUCTO

  async create(createProductDto: CreateProductDto){

    try {
      
      const product = this.productRepository.create( createProductDto ) 
      await this.productRepository.save( product );  
      return product;
    
    } catch (error) {   
        this.handleDBExeptions(error)
    }   
  }


  // TRAE TODOS LOS PRODUCTOS Y LOS PAGINA

  findAll( paginationDto : PaginationDto ) {

    const {limit = 10, offset = 0} = paginationDto
    return this.productRepository.find({
      take:limit,
      skip:offset,
      // TODO: relaciones
    })
  }


  // BUSCA LOS PRODUCTOS POR ID 

  async findOne(term: string) {

    let product : Product

      if(  isUUID( term ) ) {
        product = await this.productRepository.findOneBy({ id: term });
      }else{
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where('UPPER(title) =:title or slug =:slug',{
            title: term.toUpperCase(),
            slug:  term.toLowerCase(),
          }).getOne()
      }

      if(!product)
        throw new NotFoundException(`Product whit id ${ term }, not found`)
    
    return product
     
  }


  // ACTUALIZA LOS PRODUCTOS 

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const product = await this.productRepository.preload({
      id:id,
      ...updateProductDto
    })

    if( !product ) throw new NotFoundException(` Product with id: ${ id } not found`)

    try {
      await this.productRepository.save( product )
      return  product  
         
    } catch (error) {
      this.handleDBExeptions(error)
    }


    
  }


  // ELIMINA EL PRODUCTO POR ID

  async remove(id: string) {

    const product = await this.findOne( id );
    await this.productRepository.remove( product )
      return `${id} has been successfully removed`;
  }


  // METODO PRIVADO PARA MANEJO DE ERRORES

  private handleDBExeptions(error: any){

    if( error.code === '23505')
    throw new BadRequestException(error.detail);
  
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
