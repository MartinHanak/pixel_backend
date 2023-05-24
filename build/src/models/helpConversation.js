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
exports.HelpConversation = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const game_1 = require("./game");
let HelpConversation = class HelpConversation extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], HelpConversation.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => game_1.Game),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HelpConversation.prototype, "gameId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => game_1.Game),
    __metadata("design:type", game_1.Game)
], HelpConversation.prototype, "game", void 0);
__decorate([
    (0, sequelize_typescript_1.Is)('Role', (value) => {
        if (!(value === "user" || value === "system" || value === "assistant")) {
            throw new Error(`${value} is not one of the possible roles (user, system or assistant)`);
        }
    }),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HelpConversation.prototype, "role", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HelpConversation.prototype, "selectedCharacter", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], HelpConversation.prototype, "content", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HelpConversation.prototype, "questionOrder", void 0);
HelpConversation = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        underscored: false,
        tableName: "help_conversations",
        modelName: "helpConversation"
    })
], HelpConversation);
exports.HelpConversation = HelpConversation;
//# sourceMappingURL=helpConversation.js.map