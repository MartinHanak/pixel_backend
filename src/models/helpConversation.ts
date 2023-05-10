import { Optional } from "sequelize"
import { Table, Model, Column, DataType, ForeignKey, Is, BelongsTo } from "sequelize-typescript";
import { Game } from "./game";


import {roleType}  from './questionConversation'
import { AvailableCharacters } from "./characters";

interface HelpConversationAttributes {
    id: number,
    gameId: number,
    selectedCharacter: AvailableCharacters 
    role: roleType,
    content: string,
    questionOrder: number
}

export type HelpConversationCreationAttributes = Optional<HelpConversationAttributes, 'id'>


@Table({
    timestamps: true,
    underscored: false,
    tableName: "help_conversations",
    modelName: "helpConversation"
})
export class HelpConversation extends Model<HelpConversationAttributes, HelpConversationCreationAttributes> {
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

    @Column
    selectedCharacter!: string

    @Column(DataType.TEXT)
    content!: string;

    @Column
    questionOrder!: number;
}