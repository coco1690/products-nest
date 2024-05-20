import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ImagesProducts } from "./images-products.entity";


// PASO CERO CREAR LA ENTIDAD Y LUEGO IR A PRODUCTS MODEL Y PASAR LA ENTIDAD 'PRODUCT' EN EL MODELO 
// TypeOrmModule.forFeature([ Product ])

@Entity({ name: 'products'})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique: true,
    })
    title: string;

    @Column('float',{ 
        default:0
    })
    price:number;

    @Column('text',{
        nullable:true
    })
    description:string;

    @Column('text',{
        unique:true
    })
    slug: string;

    @Column('int',{
        default: 0
    })
    stock:number;


    @Column('text',{
        array:true
    })
    sizes: string[];

    @Column('text')
    gender:string;

    @Column('text',{
        array:true,
        default: []
    })
    tags:string[];

    @OneToMany(
        () => ImagesProducts,
        (imageProducts) => imageProducts.product,
        { cascade: true, eager:true }
    )
    images?:ImagesProducts[];








    //METODOS ANTES DE LA INSERCION DE DATOS A LA DB


    // REALIZA EL CAMBIO DE MINUSCULA PARA INSERTA A LA DB EN MAYUSCULA
    @BeforeInsert()
    sizeUpperCase(){
        const sizesUppercase = this.sizes.map( element  => {
            return element.toUpperCase()
          })   
          this.sizes = sizesUppercase
    }

    // IDENTIFICA SI EL SLUG VIENE Y SI NO COPIA EL TITULO REMPLAZANDO LOS ESPACIOS 
    @BeforeInsert()
    checkSlug(){
        if( !this.slug ){
            this.slug = this.title
            
        }
            this.slug = this.slug
            .toLowerCase()
            .replaceAll( ' ', '_')
            .replaceAll("'", '')
        
    }

    // ANTES DE ACTUALIZAR VALIDA EL SLUG POR SI VIENE CON ALGUN CARACTER ESPECIAL O ESPACIOS
    @BeforeUpdate()
    updateValidateSlug(){

        this.slug = this.slug
            .toLowerCase()
            .replaceAll( ' ', '_')
            .replaceAll("'", '')

    }


}
 