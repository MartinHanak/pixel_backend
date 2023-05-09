import { Sequelize } from "sequelize-typescript";
// for migrations:
import { join } from "path";
import { SequelizeTypescriptMigration } from "sequelize-typescript-migration-lts";
import { Umzug, SequelizeStorage } from "umzug";

import { User } from "../models/user";
import { Game } from "../models/game";
import { Conversation } from "../models/conversation";
import { QuestionConversation } from "../models/questionConversation";
import { InitializationCheck } from "../models/InitializationCheck";
import { GameProgress } from "../models/gameProgress";

import { DATABASE_URL  } from './config';
import { HelpConversation } from "../models/helpConversation";


export const sequelize = new Sequelize( DATABASE_URL  as string, {
    dialect: "postgres",
    logging: false,
    models: [User, Game, Conversation, QuestionConversation, InitializationCheck, GameProgress, HelpConversation]
} );


// run migrations
const runMigrations = async () => {
    const migrator = new Umzug({
        migrations: {
            glob: join(__dirname, '../migrations/*.js'),
            resolve: ({ name, path, context }) => {
            // adjust the migration parameters Umzug will
            // pass to migration methods, this is done because 
            // Sequilize-CLI generates migrations that require 
            // two parameters be passed to the up and down methods
            // but by default Umzug will only pass the first
            const migration = require(path || '')
            return {
                name,
                up: async () => migration.up(context, Sequelize),
                down: async () => migration.down(context, Sequelize),
            }
        },
        },
        // storage name has to match the expected SequelizeTypescriptMigration name = SequelizeMeta
        storage: new SequelizeStorage({ sequelize, tableName: 'SequelizeMeta'}),
        context: sequelize.getQueryInterface(),
        logger: console,
    })

    const migrations = await migrator.up()
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name)
    })
}


export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();

        // create migration file
        await SequelizeTypescriptMigration.makeMigration(sequelize, {
            outDir: join(__dirname, '../migrations'),
            migrationName: `${Date.now()}_migration`,
            preview: false
        }) 

        await runMigrations();

        // only enable if migrations not used
        // await sequelize.sync({force: true});

        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return process.exit(1);
    }

    return null;
};

