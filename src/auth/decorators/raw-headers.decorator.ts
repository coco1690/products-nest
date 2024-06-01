import { ExecutionContext, createParamDecorator, InternalServerErrorException } from '@nestjs/common';




export const RawHeadersDecorators = createParamDecorator(
    (data:string, ctx:ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        const rawHeaders = req.rawHeaders
        
        if( !rawHeaders )
            throw new InternalServerErrorException('no found rawheaders')

        return rawHeaders;

    }
)