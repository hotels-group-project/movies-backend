import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from './film/film.model';
import { FilmModule } from './film/film.module';
import { FilmGenres } from './genre/film-genre-model';
import { Genre } from './genre/genre.model';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [  
    ConfigModule.forRoot({
    envFilePath: '.env'
  }),
  SequelizeModule.forRoot({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    models: [Film, Genre, FilmGenres],
    autoLoadModels: true
  }),
    FilmModule,
    GenreModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
