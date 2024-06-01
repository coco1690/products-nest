import { Controller, Get, Post, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { Auth,GetUserDecorators, RawHeadersDecorators, RoleProtected } from './decorators';
import { ValidRoles } from './interface';




@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post( 'register' )
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post( 'login' )
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }

  @Get('check-status')
  @Auth( ValidRoles.user )
  checkAuthStatus(
    @GetUserDecorators() user:User
  ){
    return this.authService.checkAuthStatus(user)
  }












  @Get('private')
  @UseGuards( AuthGuard() ) 
  testingPrivateRute(
    @GetUserDecorators( ) user:User,
    @GetUserDecorators('email') userEmail:string,
    @RawHeadersDecorators() rawHeaders: string[]
  ){
    return {
      user,
      userEmail,
      rawHeaders
    }
  }

  @Get('private2')
  // @SetMetadata('roles',['admin', 'super-user'])
  @RoleProtected( ValidRoles.superUser, ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivateRute2(
    @GetUserDecorators() user: User
  ){
    return{
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth( ValidRoles.admin)
  testingPrivateRute3(
    @GetUserDecorators() user: User
  ){
    return{
      ok: true,
      user
    }
  }
 
}

