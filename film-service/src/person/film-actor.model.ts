import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Film } from "../film/film.model";
import { Person } from "./person.model";

@Table({tableName : 'film_persons', createdAt : false, updatedAt : false})
export class FilmPersons extends Model<FilmPersons>{

    @ForeignKey(() => Film)
    @Column({type : DataType.INTEGER, allowNull: false})
    film_id : number;

    @ForeignKey(() => Person)
    @Column({type : DataType.INTEGER, allowNull: false})
    person_id : number;
}