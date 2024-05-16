import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './product.entity';

@Entity()
export class ImagesProducts{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string

    @ManyToOne(
        () => Product,
        ( products ) => products.images
    )
    product:Product
}