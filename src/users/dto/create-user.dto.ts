
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from 'src/common/enums/role.enums';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  username: string;

  @IsString()
  @MinLength(1)
  password: string;

  @IsEnum(Roles, {
    message: 'priority must be one of: user, admin',
  })
  @IsNotEmpty()
  role?: Roles;
}