'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "users", deps: []
 * createTable "conversations", deps: []
 * createTable "question_conversations", deps: []
 * createTable "initializationCheck", deps: []
 * createTable "games", deps: [users]
 *
 **/

const info = {
    "revision": 1,
    "name": "1681317384901_migration",
    "created": "2023-04-12T16:36:24.950Z",
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
                state: '{"revision":1,"tables":{"users":{"tableName":"users","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"username":{"seqType":"Sequelize.STRING","allowNull":false,"unique":true},"password":{"seqType":"Sequelize.STRING","allowNull":false}},"indexes":{}},"games":{"tableName":"games","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"userId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"correctlyAnswered":{"seqType":"Sequelize.INTEGER"},"numberOfQuestions":{"seqType":"Sequelize.INTEGER"},"theme":{"seqType":"Sequelize.TEXT","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}},"conversations":{"tableName":"conversations","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER"},"role":{"seqType":"Sequelize.STRING"},"content":{"seqType":"Sequelize.TEXT"},"questionOrder":{"seqType":"Sequelize.INTEGER"}},"indexes":{}},"question_conversations":{"tableName":"question_conversations","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER"},"role":{"seqType":"Sequelize.STRING"},"content":{"seqType":"Sequelize.TEXT"},"questionOrder":{"seqType":"Sequelize.INTEGER"}},"indexes":{}},"initializationCheck":{"tableName":"initializationCheck","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER"},"questionOrder":{"seqType":"Sequelize.INTEGER"},"initialized":{"seqType":"Sequelize.BOOLEAN"}},"indexes":{}}}}'
            }],
            {}
        ]
    },




    {
        fn: "createTable",
        params: [
            "users",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "username": {
                    "unique": true,
                    "allowNull": false,
                    "type": Sequelize.STRING
                },
                "password": {
                    "allowNull": false,
                    "type": Sequelize.STRING
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "conversations",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "gameId": {
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
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "question_conversations",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "gameId": {
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
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "initializationCheck",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "gameId": {
                    "type": Sequelize.INTEGER
                },
                "questionOrder": {
                    "type": Sequelize.INTEGER
                },
                "initialized": {
                    "type": Sequelize.BOOLEAN
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "games",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "userId": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true,
                    "type": Sequelize.INTEGER
                },
                "correctlyAnswered": {
                    "type": Sequelize.INTEGER
                },
                "numberOfQuestions": {
                    "type": Sequelize.INTEGER
                },
                "theme": {
                    "allowNull": true,
                    "type": Sequelize.TEXT
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
        fn: "dropTable",
        params: ["games"]
    },
    {
        fn: "dropTable",
        params: ["users"]
    },
    {
        fn: "dropTable",
        params: ["conversations"]
    },
    {
        fn: "dropTable",
        params: ["question_conversations"]
    },
    {
        fn: "dropTable",
        params: ["initializationCheck"]
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
