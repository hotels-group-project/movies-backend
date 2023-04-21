import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Film } from "../film/film.model";
import { FilmPersons } from "./film-actor.model";

interface PersonCreationAttr{
    name: string
    enName: string
    photo: string
    description: string
    profession: string
    enProfession: string
}

@Table({tableName : 'persons', createdAt : false, updatedAt : false})
export class Person extends Model<Person, PersonCreationAttr>{

    @Column({type : DataType.INTEGER, unique : true, autoIncrement : true, primaryKey: true})
    person_id: number;

    @Column({type : DataType.STRING})
    name: string;    

    @Column({type : DataType.STRING})
    enName: string;  

    @Column({type : DataType.TEXT})
    photo: string;   
    
    @Column({type : DataType.TEXT})
    description: string;  

    @Column({type : DataType.STRING})
    profession: string;

    @Column({type : DataType.STRING})
    enProfession: string;
 
    @BelongsToMany(() => Film, () => FilmPersons)
    films: Film[];    

    // "photo": "https://st.kp.yandex.net/images/actor_iphone/iphone360_6317.jpg",
    //   "name": "Пол Уокер",
    //   "enName": "Paul Walker",
    //   "description": "string",
    //   "profession": "string",
    //   "enProfession": "string"
}