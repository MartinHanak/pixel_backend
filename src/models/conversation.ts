import { Optional } from "sequelize"
import { Table, Model, Column, DataType, ForeignKey, Is, BelongsTo } from "sequelize-typescript";
import { Game } from "./game";


export type roleType = "system" | "user" | "assistant";

interface ConversationAttributes {
    id: number,
    gameId: number, 
    role: roleType,
    content: string,
    questionOrder: number
}

export type ConversationCreationAttributes = Optional<ConversationAttributes, 'id'>

@Table({
    timestamps: false,
    underscored: false,
    tableName: "conversations",
    modelName: "conversation"
})
export class Conversation extends Model<ConversationAttributes, ConversationCreationAttributes> {
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

    @Is('Role', (value) => {
        if (!(value === "user" || value === "system" || value === "assistant")) {
            throw new Error(`${value} is not one of the possible roles (user, system or assistant)`)
        }
    })
    @Column
    role!: string;


    @Column(DataType.TEXT)
    content!: string;

    @Column
    questionOrder!: number;


}