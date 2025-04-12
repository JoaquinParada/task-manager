
import { SetMetadata } from '@nestjs/common';
import { Roles as RolesEnum } from "../enums/role.enums";

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);