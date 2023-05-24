"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
// for migrations:
const path_1 = require("path");
const sequelize_typescript_migration_lts_1 = require("sequelize-typescript-migration-lts");
const umzug_1 = require("umzug");
const user_1 = require("../models/user");
const game_1 = require("../models/game");
const conversation_1 = require("../models/conversation");
const questionConversation_1 = require("../models/questionConversation");
const InitializationCheck_1 = require("../models/InitializationCheck");
const gameProgress_1 = require("../models/gameProgress");
const config_1 = require("./config");
const helpConversation_1 = require("../models/helpConversation");
exports.sequelize = new sequelize_typescript_1.Sequelize(config_1.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    models: [user_1.User, game_1.Game, conversation_1.Conversation, questionConversation_1.QuestionConversation, InitializationCheck_1.InitializationCheck, gameProgress_1.GameProgress, helpConversation_1.HelpConversation]
});
// run migrations
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    const migrator = new umzug_1.Umzug({
        migrations: {
            glob: (0, path_1.join)(__dirname, '../migrations/*.js'),
            resolve: ({ name, path, context }) => {
                // adjust the migration parameters Umzug will
                // pass to migration methods, this is done because 
                // Sequilize-CLI generates migrations that require 
                // two parameters be passed to the up and down methods
                // but by default Umzug will only pass the first
                const migration = require(path || '');
                return {
                    name,
                    up: () => __awaiter(void 0, void 0, void 0, function* () { return migration.up(context, sequelize_typescript_1.Sequelize); }),
                    down: () => __awaiter(void 0, void 0, void 0, function* () { return migration.down(context, sequelize_typescript_1.Sequelize); }),
                };
            },
        },
        // storage name has to match the expected SequelizeTypescriptMigration name = SequelizeMeta
        storage: new umzug_1.SequelizeStorage({ sequelize: exports.sequelize, tableName: 'SequelizeMeta' }),
        context: exports.sequelize.getQueryInterface(),
        logger: console,
    });
    const migrations = yield migrator.up();
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name)
    });
});
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate();
        // create migration file
        yield sequelize_typescript_migration_lts_1.SequelizeTypescriptMigration.makeMigration(exports.sequelize, {
            outDir: (0, path_1.join)(__dirname, '../migrations'),
            migrationName: `${Date.now()}_migration`,
            preview: false
        });
        yield runMigrations();
        // only enable if migrations not used
        // await sequelize.sync({force: true});
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        return process.exit(1);
    }
    return null;
});
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=db.js.map