
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../entities/user.entity";
import { JwtPayload } from "../interface/jwt-payload.interface";


// EN EL AUTH.MODULES IMPORTO Y EXPORTO EL JWTSTRATEGIE EN LOS PROVIDERS
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository( User )
        private readonly userRepository : Repository<User>,

        configservice: ConfigService
    ){ 
        super({
            secretOrKey:configservice.get( 'JWT_SECRET' ),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }); 
    }

// ESTE METODO SE VA LLAMAR SI EL JWT NO HA EXPIRADO Y SI LA FIRMA DEL JWT HACE MATCH CON EL PAYLOAD
    async validate( payload: JwtPayload ): Promise<User> {

        const { id } = payload
        const user = await this.userRepository.findOneBy({ id })

        if( !user )
            throw new UnauthorizedException(' Token not valid ')
        if( !user.isActive)
            throw new UnauthorizedException(' User is inactive, talk with an admin ')
            
        return user;
    }
}