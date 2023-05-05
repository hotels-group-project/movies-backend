import { BelongsToMany, Column, DataType, HasOne, Model, Table } from "sequelize-typescript"
import { AddUserDto } from "./dto/add_user.dto";

@Table({tableName : 'users'})
export class User extends Model<User, AddUserDto>{
    @Column({type : DataType.INTEGER, unique : true, autoIncrement : true, primaryKey: true})
    user_id : number;

    @Column({type : DataType.STRING, unique : true, allowNull : false})
    login : string;

    @Column({type : DataType.STRING, unique : true, allowNull : false})
    email : string;

    @Column({type : DataType.STRING, allowNull : false})
    password : string;        

    @Column({type : DataType.STRING, allowNull : false})
    role : string;
}