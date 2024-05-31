import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt' //yarn add -D @types/bcrypt

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interface/jwt-payload.interface';



@Injectable()
export class AuthService {

  constructor(

    @InjectRepository( User )
    private readonly userRepositiry: Repository<User>,

    // INYECTO EL SERVICIO PARA GENERAR EL JWT EN EL METODO GETJWTOKEN
    private readonly jwtService: JwtService

  ){}



  // ############## CREO UN USUARIO  #################

   async create( createUserDto: CreateUserDto ) {
     try { 

      const { password, ...userData } = createUserDto

      const user =  this.userRepositiry.create( {
        ...userData,
        password: bcrypt.hashSync( password, 10 )// ENCRIPTO LA CONTRASEÑA
      } );

      await this.userRepositiry.save( user );
      delete user.password;

      return {
        ...user,
        token: this.getJwToken( { id: user.id })
      }
      
      // TODO: retornar el JWT de acceso
      
     } catch (error) {
      
      this.handleDBErrors( error )
      
     }
  }



  // ##############  HAGO LOGIN  ####################

  async login( loginUserDto: LoginUserDto ) {

    const { password, email } = loginUserDto

    const user = await this.userRepositiry.findOne({
      where:  { email },
      select: { email: true, password: true, id: true }
    });

    if( !user )
      throw new UnauthorizedException( ' Credentials are not valid ( email ) ');
    if( !bcrypt.compareSync( password, user.password ) )// comparo la contraseña con la del usuario da la DB
      throw new UnauthorizedException( ' Credentials are not valid ( pass ) ');

      delete user.password;
      return {
        ...user,
        token: this.getJwToken( { id: user.id })
      }

      //TODO: retornar el JWT 
  }



  //###########   methods   ####################

  private getJwToken( payload:JwtPayload){

      //GENERO EL TOKEN
      const token = this.jwtService.sign( payload )
      return token
  }

  private handleDBErrors( error:any ): never { //never jamas deja regresar un valor ejm return: true
    if( error.code === '23505')
      throw new BadRequestException( error.detail );
    console.log( error );

    throw new InternalServerErrorException( ' please check server logs ')
    
  }
 
}


// SE REQUIREN INSTALAR LAS SIGUIENTES DEPENDENCIAS PARA TRABAJAR EL JWT
// yarn add @nestjs/passport passport
// yarn add @nestjs/jwt passport-jwt
// yarn add -D @types/passport-jwt