import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(

    // se inyecta el reflector de @nest/core
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // VALIDO LOS ROLESQUE VIENEN DE @SetMetada()
    const validRoles: string[] = this.reflector.get( META_ROLES, context.getHandler())

    // para validar, se puede borrar
    // if( !validRoles ) return true;
    // if( validRoles.length === 0 ) return true;

    // TRAIGO EL USUARIO DE LA REQUEST
    const req = context.switchToHttp().getRequest();
    const user = req.user as User

    if( !user )//valido si el usuario no existe
      throw new BadRequestException('user no found');
    
    // me recorre los roles que esxiste en el user.roles y 
    // luego valida si validRoles incluye algunos de los roles del user.roles
    for( const role of user.roles) {
      if( validRoles.includes( role ) ) {
        return true
      }
    }
      
    throw new ForbiddenException( `User ${ user.fullName } need a valid role: [${ validRoles }]`);
    
  }
}
