import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Film } from "../film/film.model";
import { Country } from "./country.model";

@Table({tableName : 'film_countries', createdAt : false, updatedAt : false})
export class FilmCountries extends Model<FilmCountries>{

    @ForeignKey(() => Film)
    @Column({type : DataType.INTEGER, allowNull: false})
    film_id : number;

    @ForeignKey(() => Country)
    @Column({type : DataType.INTEGER, allowNull: false})
    country_id : number;
}