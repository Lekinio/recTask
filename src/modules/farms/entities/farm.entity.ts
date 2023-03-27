import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";

@Entity()
export class Farm {
    @PrimaryGeneratedColumn("uuid")
    public readonly id: string;

    @Column()
    public name: string;

    @Column()
    public address: string;

    @Column()
    public coordinates: string;

    @Column({type: "float"})
    public size: number;

    @Column({type: "float"})
    public yield: number;

    @Column()
    public userId: string;

    @ManyToOne(() => User, (user) => user.farms)
    user?: User

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}