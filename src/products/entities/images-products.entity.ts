import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './product.entity';

@Entity({ name: 'products_images'})
export class ImagesProducts{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string

    @ManyToOne(
        () => Product,
        ( products ) => products.images,
        { onDelete: "CASCADE" }
    )
    product:Product
}