import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from "uuid"; // 1.yarn add uuid  2.yarn add -D @types/uuid
import { ImagesProducts,Product } from './entities';






@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

constructor(

  // INYECTO LA ENTITY

  @InjectRepository( Product )
  private readonly productRepository: Repository<Product>,

  @InjectRepository( ImagesProducts )
  private readonly imagesProductsRepository: Repository<ImagesProducts>,

  private readonly dataSource: DataSource,

) {}
  

  // ###################  CREO EL PRODUCTO ################### 

  async create(createProductDto: CreateProductDto){
  
    try {

      const { images = [], ...productDetails } = createProductDto
      
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.imagesProductsRepository.create({ url: image }))
      }) 

      await this.productRepository.save( product );  
      return product;
    
    } catch (error) {   
        this.handleDBExeptions(error)
    }   
  }


  // ###################  TRAE TODOS LOS PRODUCTOS Y LOS PAGINA ################### 

  findAll( paginationDto : PaginationDto ) {

    const {limit = 10, offset = 0} = paginationDto
    return this.productRepository.find({
      take:limit,
      skip:offset,
      relations:{
        images: true
      }
      // TODO: relaciones
    })
  }


  // ###################  BUSCA LOS PRODUCTOS POR ID Y SLUG ################### 

  async findOne(term: string) {

    let product : Product

      if(  isUUID( term ) ) {
        product = await this.productRepository.findOneBy({ id: term });
      }else{
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        product = await queryBuilder
          .where('UPPER(title) =:title or slug =:slug',{
            title: term.toUpperCase(),
            slug:  term.toLowerCase(),
          })
          .leftJoinAndSelect('prod.images','imageproduct')
          .getOne()
      }

      if(!product)
        throw new NotFoundException(`Product whit id ${ term }, not found`)
    
    return product
     
  }


  //################### ACTUALIZA LOS PRODUCTOS #####################

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    // ( preload )..PRECARGA LOS DATOS PRIMERO ANTES DE ACTUALIZARLOS
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id,...toUpdate})

    // SI EL PRODUCTO NO EXISTE MANDA UN ERROR
    if( !product ) throw new NotFoundException(` Product with id: ${ id } not found `)

    // CREO EL METODO QUERYRUNNER
    const queryRunner = this.dataSource.createQueryRunner();

    // ME CONECTO A LA DB MEDIANTE EL QUERY RUNNER 
    await queryRunner.connect();
    
    // REALIZA EL START DE LA TRANSACCION 
    await queryRunner.startTransaction();

    try {

      if( images ) {

        // ELIMINAMOS LAS IMAGENES GUARDADAS EN DB
        await queryRunner.manager.delete( ImagesProducts, { product: { id } } );

        product.images = images.map( 
          image => this.imagesProductsRepository.create( { url: image } ) 
        )
      } else{
        product.images = await this.imagesProductsRepository.findBy({ product:{id}});
      }

      // ACA NO IMPACTO EN LA BD TODAVIA
      await queryRunner.manager.save( product );

      // ACA HAGO EL COMMIT DE LA TRANSACCION O LOS DATOS 
      await queryRunner.commitTransaction()
      // CIERRO EL QUERY RUNNER
      await queryRunner.release()

      // ACTUALIZA EL PRODUCTO EN DB
      return  product  

      // GUARDA EL PRODUCTO
      // await this.productRepository.save( product )

    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      
      this.handleDBExeptions(error)
    }
  }

 
  // ###################  ELIMINA EL PRODUCTO POR ID ################### 

  async remove(id: string) {

    const product = await this.findOne( id );
    await this.productRepository.remove( product )
      return `${id} has been successfully removed`;
  }


  // ###################  METODO PRIVADO PARA MANEJO DE ERRORES ################### 

  private handleDBExeptions(error: any){

    if( error.code === '23505')
    throw new BadRequestException(error.detail);
  
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  // ######### SOLO EN DESARROLLO LO QUE HACE EL METODO ES BORRAR LOS PRODUCTOS  ########

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try {
        return await query
          .delete()
          .where({})
          .execute();

    } catch (error) {
      
      this.handleDBExeptions( error )

    }
  }

}
