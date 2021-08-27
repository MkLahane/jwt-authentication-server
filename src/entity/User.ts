import { Field, ObjectType, Int } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
    @Field(() => Int) //it cannot infer if number is integer or float
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    email: string;

    @Column()
    password: string;
}
