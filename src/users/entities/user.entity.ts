
import { Roles } from 'src/common/enums/role.enums';
import { Task } from 'src/tasks/entities/task.entity';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'text',
    })
    username: string;

    @Column({
        type: "text",
        select: false

    })
    password: string

    @Column({ type: 'enum', enum: Roles, default: Roles.User })
    role: Roles;


    @OneToMany(() => Task, (task) => task.user, { cascade: true })
    tasks: Task[];
}