import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from 'src/film/film.model';
import { FilmPersons } from './film-actor.model';
import { PersonController } from './person.controller';
import { Person } from './person.model';
import { PersonService } from './person.service';

@Module({
  controllers: [PersonController],
  providers: [PersonService],
  imports: [
    SequelizeModule.forFeature([Film, Person, FilmPersons]),
  ],
  exports : [PersonService]
})
export class PersonModule {}
