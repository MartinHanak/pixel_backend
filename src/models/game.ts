import { Table, Model, Column, DataType, ForeignKey, AllowNull, BelongsTo, HasMany, Default } from "sequelize-typescript";
import { User } from "./user";
import { Optional } from "sequelize";
import { Conversation } from "./conversation";
import { QuestionConversation } from "./questionConversation";
import { InitializationCheck } from "./InitializationCheck";
import { GameProgress } from "./gameProgress";


interface GameAttributes {
    id: number;
    userId: number;
    correctlyAnswered: number;
    numberOfQuestions: number;
    theme?: string;
    gameOver: boolean;
}

export type GameCreationAttributes = Optional<GameAttributes, 'id' | 'gameOver'>

@Table({
    timestamps: true,
    underscored: false,
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

    @BelongsTo(() => User)
    user!: User;

    @Column
    correctlyAnswered!: number;

    @Default(16)
    @Column 
    numberOfQuestions!: number;

    @AllowNull
    @Column(DataType.TEXT)
    theme!: string;

    @Default(false)
    @Column 
    gameOver!: boolean;


    @HasMany(() => Conversation)
    conversations!: Conversation[];

    @HasMany(() => QuestionConversation)
    questionConversations!: QuestionConversation[];

    @HasMany(() => InitializationCheck)
    initializationChecks!: InitializationCheck[];

    @HasMany(() => GameProgress)
    gameProgress!: GameProgress[];
}