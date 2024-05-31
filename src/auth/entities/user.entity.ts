import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity( 'users' )
export class User {

    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column( 'text',{ unique: true })
    email:string;

    @Column( 'text', { select:false } )
    password: string;

    @Column( 'text' )
    fullName: string;

    @Column( 'bool',{ default:true } )
    isActive: boolean;

    @Column( 'text',{ array:true, default:[ 'user' ] } )
    roles: string[];

    @BeforeInsert()
    checkFieldsBeforInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforUpdate(){
        this.checkFieldsBeforInsert()
    }


    
}
