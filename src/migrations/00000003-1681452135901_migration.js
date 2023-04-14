'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "gameProgress", deps: [games]
 *
 **/

const info = {
    "revision": 3,
    "name": "1681452135901_migration",
    "created": "2023-04-14T06:02:15.937Z",
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
                state: '{"revision":3,"tables":{"users":{"tableName":"users","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"username":{"seqType":"Sequelize.STRING","allowNull":false,"unique":true},"password":{"seqType":"Sequelize.STRING","allowNull":false}},"indexes":{}},"games":{"tableName":"games","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"userId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"correctlyAnswered":{"seqType":"Sequelize.INTEGER"},"numberOfQuestions":{"seqType":"Sequelize.INTEGER"},"theme":{"seqType":"Sequelize.TEXT","allowNull":true},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}},"conversations":{"tableName":"conversations","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"role":{"seqType":"Sequelize.STRING"},"content":{"seqType":"Sequelize.TEXT"},"questionOrder":{"seqType":"Sequelize.INTEGER"}},"indexes":{}},"question_conversations":{"tableName":"question_conversations","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"role":{"seqType":"Sequelize.STRING"},"content":{"seqType":"Sequelize.TEXT"},"questionOrder":{"seqType":"Sequelize.INTEGER"}},"indexes":{}},"initializationCheck":{"tableName":"initializationCheck","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"questionOrder":{"seqType":"Sequelize.INTEGER"},"initialized":{"seqType":"Sequelize.BOOLEAN"}},"indexes":{}},"gameProgress":{"tableName":"gameProgress","schema":{"id":{"seqType":"Sequelize.INTEGER","primaryKey":true,"autoIncrement":true},"gameId":{"seqType":"Sequelize.INTEGER","allowNull":true,"references":{"model":"games","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"questionOrder":{"seqType":"Sequelize.INTEGER"},"correctlyAnswered":{"seqType":"Sequelize.BOOLEAN"},"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false}},"indexes":{}}}}'
            }],
            {}
        ]
    },




    {
        fn: "createTable",
        params: [
            "gameProgress",
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
                "questionOrder": {
                    "type": Sequelize.INTEGER
                },
                "correctlyAnswered": {
                    "type": Sequelize.BOOLEAN
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
        params: ["gameProgress"]
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
