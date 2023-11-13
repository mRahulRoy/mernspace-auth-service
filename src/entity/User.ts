import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

//this will name the table as users
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column()
    role: string;
}
