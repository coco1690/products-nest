import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{

    @IsOptional()
    @IsPositive()
    @Type( () => Number ) // Esto es igual enableImplicitConversions: true
    limit?: number;


    @IsOptional()
    @Min( 0 )
    @Type( () => Number ) // Esto es igual enableImplicitConversions: true
    offset?: number;
}