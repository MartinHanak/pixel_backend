import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";
import { User } from "./user";
import { Optional } from "sequelize";


interface GameAttributes {
    id: number;
    userId: number;
    correctlyAnswered: number;
    numberOfQuestions: number;
}

export type GameCreationAttributes = Optional<GameAttributes, 'id'>

@Table({
    timestamps: true,
    underscored: true,
    tableName: "games",
    modelName: "game"
})
export class Game extends Model<GameAttributes,GameCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @Column
    correctlyAnswered!: number;

    @Column 
    numberOfQuestions!: number;


}