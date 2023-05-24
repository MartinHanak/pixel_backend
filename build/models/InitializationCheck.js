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
exports.InitializationCheck = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const game_1 = require("./game");
let InitializationCheck = class InitializationCheck extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }),
    __metadata("design:type", Number)
], InitializationCheck.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => game_1.Game),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], InitializationCheck.prototype, "gameId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => game_1.Game),
    __metadata("design:type", game_1.Game)
], InitializationCheck.prototype, "game", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], InitializationCheck.prototype, "questionOrder", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], InitializationCheck.prototype, "initialized", void 0);
InitializationCheck = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: false,
        underscored: false,
        tableName: "initializationCheck",
        modelName: "initializationCheck"
    })
], InitializationCheck);
exports.InitializationCheck = InitializationCheck;
//# sourceMappingURL=InitializationCheck.js.map