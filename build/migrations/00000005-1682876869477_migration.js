'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "help_conversations", deps: [games]
 * addColumn "usedHelpline" to table "games"
 * addColumn "usedAudience" to table "games"
 * addColumn "used5050" to table "games"
 *
 **/

const info = {
    "revision": 5,
    "name": "1682876869477_migration",
    "created": "2023-04-30T17:47:49.506Z",
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
                state: '{"revision":5,"tables":{"users":{"tableName":"users","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"username":{"seqType":"Sequelize.STRING","allowNull":false,"unique":true},"password":{"seqType":"Sequelize.STRING","allowNull":false}},"indexes":{}},"games":{"tableName":"games","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"userId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"correctlyAnswered":{"seqType":"Sequelize.INTEGER"},"numberOfQuestions":{"seqType":"Sequelize.INTEGER"},"theme":{"seqType":"Sequelize.TEXT","allowNull":true},"gameOver":{"seqType":"Sequelize.BOOLEAN"},"used5050":{"seqType":"Sequelize.BOOLEAN"},"usedAudience":{"seqType":"Sequelize.BOOLEAN"},"usedHelpline":{"seqType":"Sequelize.BOOLEAN"},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}},"conversations":{"tableName":"conversations","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"role":{"seqType":"Sequelize.STRING"},"content":{"seqType":"Sequelize.TEXT"},"questionOrder":{"seqType":"Sequelize.INTEGER"}},"indexes":{}},"question_conversations":{"tableName":"question_conversations","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"role":{"seqType":"Sequelize.STRING"},"content":{"seqType":"Sequelize.TEXT"},"questionOrder":{"seqType":"Sequelize.INTEGER"}},"indexes":{}},"initializationCheck":{"tableName":"initializationCheck","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"questionOrder":{"seqType":"Sequelize.INTEGER"},"initialized":{"seqType":"Sequelize.BOOLEAN"}},"indexes":{}},"gameProgress":{"tableName":"gameProgress","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"questionOrder":{"seqType":"Sequelize.INTEGER"},"correctlyAnswered":{"seqType":"Sequelize.BOOLEAN"},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}},"help_conversations":{"tableName":"help_conversations","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"role":{"seqType":"Sequelize.STRING"},"content":{"seqType":"Sequelize.TEXT"},"questionOrder":{"seqType":"Sequelize.INTEGER"},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}}}}'
            }],
            {}
        ]
    },




    {
        fn: "createTable",
        params: [
            "help_conversations",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "gameId": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "games",
                        "key": "id"
                    },
                    "allowNull": true,
                    "type": Sequelize.INTEGER
                },
                "role": {
                    "type": Sequelize.STRING
                },
                "content": {
                    "type": Sequelize.TEXT
                },
                "questionOrder": {
                    "type": Sequelize.INTEGER
                },
                "createdAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                }
            },
            {}
        ]
    },
    {
        fn: "addColumn",
        params: [
            "games",
            "usedHelpline",
            {
                "type": Sequelize.BOOLEAN
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "games",
            "usedAudience",
            {
                "type": Sequelize.BOOLEAN
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "games",
            "used5050",
            {
                "type": Sequelize.BOOLEAN
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
        fn: "removeColumn",
        params: ["games", "usedHelpline"]
    },
    {
        fn: "removeColumn",
        params: ["games", "usedAudience"]
    },
    {
        fn: "removeColumn",
        params: ["games", "used5050"]
    },
    {
        fn: "dropTable",
        params: ["help_conversations"]
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
