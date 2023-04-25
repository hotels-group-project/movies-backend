import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Country } from "src/country/country.model";
import { FilmCountries } from "src/country/film-country.model";
import { FilmGenres } from "src/genre/film-genre-model";
import { Genre } from "src/genre/genre.model";
import { FilmPersons } from "src/person/film-actor.model";
import { Person } from "src/person/person.model";
import { AddFilmDto } from "./dto/add-film-dto";

@Table({tableName : 'films', createdAt : false, updatedAt : false})
export class Film extends Model<Film, AddFilmDto>{

    @Column({type : DataType.INTEGER, unique : true, autoIncrement : true, primaryKey: true})
    film_id : number;

    @Column({type : DataType.STRING, unique : true, allowNull : false})
    name : string;    

    @Column({type : DataType.STRING})
    alternativeName: string;

    @Column({type : DataType.INTEGER})
    year : number;

    @Column({type : DataType.TEXT})
    description : string

    @Column({type : DataType.TEXT})
    shortDescription: string

    @Column({type : DataType.TEXT})
    slogan: string

    @Column({type : DataType.TEXT})
    trailer : string

    @Column({type : DataType.TEXT})
    poster : string

    @Column({type : DataType.REAL})
    kprating: number

    @Column({type : DataType.REAL})
    kpvotes: number

    @Column({type : DataType.INTEGER})
    movieLength: number;

    @Column({type : DataType.INTEGER})
    ageRating: number;
    
    @BelongsToMany(() => Country, () => FilmCountries)
    countries: Country[];
 
    @BelongsToMany(() => Genre, () => FilmGenres)
    genres: Genre[];

    @BelongsToMany(() => Person, () => FilmPersons)
    staff: Person[];

}