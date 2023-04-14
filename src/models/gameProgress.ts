import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Optional } from "sequelize";
import { Game } from "./game";

interface gameProgress {
    id: number,
    gameId: number,
    questionOrder: number,
    correctlyAnswered: boolean
}

export type gameProgressCreationAttributes = Optional<gameProgress, 'id'>



@Table({
    timestamps: true,
    underscored: false,
    tableName: "gameProgress",
    modelName: "gameProgress"
})
export class GameProgress extends Model<gameProgress,gameProgressCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;   


    @ForeignKey(() => Game)
    @Column 
    gameId!: number;

    @BelongsTo(() => Game)
    game!: Game;

    @Column
    questionOrder!: number;

    @Column
    correctlyAnswered!: boolean;
}