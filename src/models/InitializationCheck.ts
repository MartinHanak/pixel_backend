import { Optional } from "sequelize"
import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Game } from "./game";

interface InitializationCheckAttributes {
    id: number;
    gameId: number;
    questionOrder: number;
    initialized: boolean;
}


export type InitializationCheckCreationAttributes = Optional<InitializationCheckAttributes, 'id' >


@Table({
    timestamps: false,
    underscored: false,
    tableName: "initializationCheck",
    modelName: "initializationCheck"
})
export class InitializationCheck extends Model <InitializationCheckAttributes, InitializationCheckCreationAttributes> {
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
    initialized!: boolean;
}