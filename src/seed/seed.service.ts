import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';




@Injectable()
export class SeedService {

    constructor(

        private readonly producService : ProductsService

    ){}

   async runSeed(){

    await this.insertNewproducts()
    return ' SEED EXECUTE '
   }  

   private async insertNewproducts(){
    // aca mando el metodo para eliminar los productos
        await this.producService.deleteAllProducts()

        const seedProducts = initialData.products;

        const insertSeedProducts = [];

        // seedProducts.forEach( seedProduct => {
        //     insertSeedProducts.push( this.producService.create( seedProduct ))
        // } );

        await Promise.all( insertSeedProducts );
        
        return true;
   }
}
