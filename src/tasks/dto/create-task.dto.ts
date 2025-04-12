import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    completed?: boolean = false;

    @IsEnum(['low', 'medium', 'high'], {
        message: 'priority must be one of: low, medium, high',
    })
    @IsNotEmpty()
    priority?: 'low' | 'medium' | 'high' = 'medium';
}

