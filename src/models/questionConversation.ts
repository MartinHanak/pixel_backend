import { Optional } from "sequelize"
import { Table, Model, Column, DataType, ForeignKey, Is } from "sequelize-typescript";
import { Game } from "./game";


export type roleType = "system" | "user" | "assistant";

interface QuestionConversationAttributes {
    id: number,
    gameId: number, 
    role: roleType,
    content: string,
    questionOrder: number
}

export type QuestionConversationCreationAttributes = Optional<QuestionConversationAttributes, 'id'>

@Table({
    timestamps: false,
    underscored: true,
    tableName: "question_conversations",
    modelName: "questionConversation"
})
export class QuestionConversation extends Model<QuestionConversationAttributes, QuestionConversationCreationAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @ForeignKey(() => Game)
    @Column
    gameId!: number;

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