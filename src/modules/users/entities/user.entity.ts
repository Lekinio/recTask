import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Farm} from "../../farms/entities";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    public readonly id: string;

    @Column()
    public address: string;

    @Column()
    public coordinates: string;

    @Column({unique: true})
    public email: string;

    @Column()
    public hashedPassword: string;

    @OneToMany(() => Farm, (farm) => farm.user)
    farms?: Farm[]

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
