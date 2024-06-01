import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesProducts, Product } from './entities';
import { AuthModule } from 'src/auth/auth.module';



@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    
    //IMPORTO LA ENTIDAD 'PRODUCT' AL MODELO
    TypeOrmModule.forFeature([ Product, ImagesProducts ]),

    AuthModule
  ],
  exports: [ 
    ProductsService,
    TypeOrmModule,
  ],
})
export class ProductsModule {}
