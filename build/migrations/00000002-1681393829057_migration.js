'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "gameId" on table "conversations"
 * changeColumn "gameId" on table "conversations"
 * changeColumn "gameId" on table "conversations"
 * changeColumn "gameId" on table "conversations"
 * changeColumn "gameId" on table "question_conversations"
 * changeColumn "gameId" on table "question_conversations"
 * changeColumn "gameId" on table "question_conversations"
 * changeColumn "gameId" on table "question_conversations"
 * changeColumn "gameId" on table "initializationCheck"
 * changeColumn "gameId" on table "initializationCheck"
 * changeColumn "gameId" on table "initializationCheck"
 * changeColumn "gameId" on table "initializationCheck"
 *
 **/

const info = {
    "revision": 2,
    "name": "1681393829057_migration",
    "created": "2023-04-13T13:50:29.082Z",
    "comment": ""
};

const migrationCommands = [

    {
        fn: "createTable",
        params: [
            "SequelizeMigrationsMeta",
            {
                "revision": {
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "name": {
                    "allowNull": false,
                    "type": Sequelize.STRING
                },
                "state": {
                    "allowNull": false,
                    "type": Sequelize.JSON
                },
            },
            {}
        ]
    },
    {
        fn: "bulkDelete",
        params: [
            "SequelizeMigrationsMeta",
            [{
                revision: info.revision
            }],
            {}
        ]
    },
    {
        fn: "bulkInsert",
        params: [
            "SequelizeMigrationsMeta",
            [{
                revision: info.revision,
                name: info.name,
                state: '{"revision":2,"tables":{"users":{"tableName":"users","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"username":{"seqType":"Sequelize.STRING","allowNull":false,"unique":true},"password":{"seqType":"Sequelize.STRING","allowNull":false}},"indexes":{}},"games":{"tableName":"games","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"userId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"correctlyAnswered":{"seqType":"Sequelize.INTEGER"},"numberOfQuestions":{"seqType":"Sequelize.INTEGER"},"theme":{"seqType":"Sequelize.TEXT","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}},"conversations":{"tableName":"conversations","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"role":{"seqType":"Sequelize.STRING"},"content":{"seqType":"Sequelize.TEXT"},"questionOrder":{"seqType":"Sequelize.INTEGER"}},"indexes":{}},"question_conversations":{"tableName":"question_conversations","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"role":{"seqType":"Sequelize.STRING"},"content":{"seqType":"Sequelize.TEXT"},"questionOrder":{"seqType":"Sequelize.INTEGER"}},"indexes":{}},"initializationCheck":{"tableName":"initializationCheck","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"questionOrder":{"seqType":"Sequelize.INTEGER"},"initialized":{"seqType":"Sequelize.BOOLEAN"}},"indexes":{}}}}'
            }],
            {}
        ]
    },



    {
        fn: "changeColumn",
        params: [
            "conversations",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "conversations",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "conversations",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "conversations",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "question_conversations",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "question_conversations",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "question_conversations",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "question_conversations",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "initializationCheck",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "initializationCheck",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "initializationCheck",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "initializationCheck",
            "gameId",
            {
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "games",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    }
];

const rollbackCommands = [

    {
        fn: "bulkDelete",
        params: [
            "SequelizeMigrationsMeta",
            [{
                revision: info.revision,
            }],
            {}
        ]
    },



    {
        fn: "changeColumn",
        params: [
            "conversations",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "conversations",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "conversations",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "conversations",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "question_conversations",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "question_conversations",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "question_conversations",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "question_conversations",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "initializationCheck",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "initializationCheck",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "initializationCheck",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "initializationCheck",
            "gameId",
            {
                "type": Sequelize.INTEGER
            }
        ]
    }
];

module.exports = {
  pos: 0,
  up: function(queryInterface, Sequelize) {
    let index = this.pos;

    return new Promise(function(resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index];
          console.log("[#"+index+"] execute: " + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        } else resolve();
      }

      next();
    });
  },
  down: function(queryInterface, Sequelize) {
    let index = this.pos;

    return new Promise(function(resolve, reject) {
      function next() {
        if (index < rollbackCommands.length) {
          let command = rollbackCommands[index];
          console.log("[#"+index+"] execute: " + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        }
        else resolve();
      }

      next();
    });
  },
  info
};
