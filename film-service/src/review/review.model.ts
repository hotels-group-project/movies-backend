import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ReviewCreationAttr } from "./dto/add-review.dto";
import { Film } from "../film/film.model";

@Table({tableName : 'reviews', createdAt : true, updatedAt : false})
export class Review extends Model<Review, ReviewCreationAttr>{

    @Column({type : DataType.INTEGER, unique : true, autoIncrement : true, primaryKey: true})
    review_id : number;    

    @Column({type : DataType.INTEGER})
    user_id : number;

    @Column({type : DataType.STRING})
    user_name : string;

    @Column({type : DataType.INTEGER})
    previous_review_id : number;

    @Column({type : DataType.TEXT})
    text : string;

    @ForeignKey(() => Film)
    @Column({field : "film_id"})
    film_id: number;

    @BelongsTo(() => Film)
    film: Film;

}