import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { FilmGenres } from "src/genre/film-genre-model";
import { Genre } from "src/genre/genre.model";

@Table({tableName : 'films', createdAt : false, updatedAt : false})
export class Film extends Model<Film>{

    @Column({type : DataType.INTEGER, unique : true, autoIncrement : true, primaryKey: true})
    film_id : number;

    @Column({type : DataType.STRING, unique : true, allowNull : false})
    title : string;    
 
    @BelongsToMany(() => Genre, () => FilmGenres)
    genres: Genre[];
}