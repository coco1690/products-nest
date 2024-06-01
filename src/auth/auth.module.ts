import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategies';

@Module({
  controllers: [AuthController],
  providers: [ AuthService, JwtStrategy ],
  imports:[ 
    ConfigModule,

    TypeOrmModule.forFeature([ User ]),

    //INICIALIZO EL PASSPORT PARA EL JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),

    //CONFIGURO EL JWT 
    JwtModule.registerAsync({
      imports: [],
      inject:  [],
      useFactory: () => {
        return{
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '2h' },
        }
      }
    })
  ],
  exports:[ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
