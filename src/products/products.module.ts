import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesProducts, Product } from './entities';



@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    
    //IMPORTO LA ENTIDAD 'PRODUCT' AL MODELO
    TypeOrmModule.forFeature([ Product, ImagesProducts ])
  ]
})
export class ProductsModule {}
