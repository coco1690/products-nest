import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";




export const  GetUserDecorators = createParamDecorator( 
    ( data: string, ctx: ExecutionContext) => {
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;       
        
        if( !user )
            throw new InternalServerErrorException( 'user nor found in (request)');
             
        return ( !data ) ? user : user[data]
    }
);