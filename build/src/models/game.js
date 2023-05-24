"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = require("./user");
const conversation_1 = require("./conversation");
const questionConversation_1 = require("./questionConversation");
const InitializationCheck_1 = require("./InitializationCheck");
const gameProgress_1 = require("./gameProgress");
const helpConversation_1 = require("./helpConversation");
let Game = class Game extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], Game.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Game.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.User),
    __metadata("design:type", user_1.User)
], Game.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Game.prototype, "correctlyAnswered", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(15),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Game.prototype, "numberOfQuestions", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Game.prototype, "theme", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Game.prototype, "gameOver", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Game.prototype, "used5050", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Game.prototype, "usedAudience", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Game.prototype, "usedHelpline", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => conversation_1.Conversation),
    __metadata("design:type", Array)
], Game.prototype, "conversations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => questionConversation_1.QuestionConversation),
    __metadata("design:type", Array)
], Game.prototype, "questionConversations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => helpConversation_1.HelpConversation),
    __metadata("design:type", Array)
], Game.prototype, "helpConversations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => InitializationCheck_1.InitializationCheck),
    __metadata("design:type", Array)
], Game.prototype, "initializationChecks", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => gameProgress_1.GameProgress),
    __metadata("design:type", Array)
], Game.prototype, "gameProgress", void 0);
Game = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        underscored: false,
        tableName: "games",
        modelName: "game"
    })
], Game);
exports.Game = Game;
//# sourceMappingURL=game.js.map