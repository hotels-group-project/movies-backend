import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Film } from "src/film/film.model";
import { FilmGenres } from "./film-genre-model";

interface GenreCreationAttr{
    name : string;    
}

@Table({tableName : 'genres', createdAt : false, updatedAt : false})
export class Genre extends Model<Genre, GenreCreationAttr>{

    @Column({type : DataType.INTEGER, unique : true, autoIncrement : true, primaryKey: true})
    genre_id : number;

    @Column({type : DataType.STRING, unique : true, allowNull : false})
    name : string;    
 
    @BelongsToMany(() => Film, () => FilmGenres)
    films: Film[];
}