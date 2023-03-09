import { Table, Model, Column, DataType } from "sequelize-typescript";
import { Optional } from 'sequelize';

interface UserAttribues {
    id: number;
    username: string;
    password: string;
    name: string;
    admin: boolean;
}

export type UserCreationAttribues = Optional<UserAttribues, 'id' | 'admin' | 'name'  >;

@Table({
    timestamps: false,
    underscored: true,
    tableName: "users",
    modelName: "user"
})
export class User extends Model<UserAttribues, UserCreationAttribues> {
    // id default from Model
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })  
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })  
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    admin!: boolean;
}
