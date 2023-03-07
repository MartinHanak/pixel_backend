import { Table, Model, Column, DataType } from "sequelize-typescript";
import sequelize from '../util/db';

class User extends Model {

}

User.init({
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user'
});