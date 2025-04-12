import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { booleanEnum } from "../enums/boolean.enums";


export class PaginationDto {

    @IsPositive()
    @IsOptional()
    @Min(1)
    @IsNumber()
    limit: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    offset: number;

    @IsOptional()
    @IsString()
    title: string

    @IsOptional()
    @IsEnum(['low', 'medium', 'high'], {
        message: 'priority must be one of: low, medium, high',
    })
    priority: 'low' | 'medium' | 'high';

    @IsOptional()
    @IsEnum(booleanEnum, {
        message: 'Completed must be one of: true, false',
    })
    completed?: booleanEnum
}