import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Film } from "../film/film.model";
import { Genre } from "./genre.model";

@Table({tableName : 'film_genres', createdAt : false, updatedAt : false})
export class FilmGenres extends Model<FilmGenres>{

    @ForeignKey(() => Film)
    @Column({type : DataType.INTEGER, allowNull: false})
    film_id : number;

    @ForeignKey(() => Genre)
    @Column({type : DataType.INTEGER, allowNull: false})
    genre_id : number;
}