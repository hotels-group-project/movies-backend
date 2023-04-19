import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Film } from "../film/film.model";
import { FilmCountries } from "./film-country.model";

interface CountryCreationAttr{
    name : string;    
}

@Table({tableName : 'countries', createdAt : false, updatedAt : false})
export class Country extends Model<Country, CountryCreationAttr>{

    @Column({type : DataType.INTEGER, unique : true, autoIncrement : true, primaryKey: true})
    country_id : number;

    @Column({type : DataType.STRING, unique : true, allowNull : false})
    name : string;    
 
    @BelongsToMany(() => Film, () => FilmCountries)
    films: Film[];
}