import { Module } from '@nestjs/common';
import { FilmModule } from './film/film.module';

@Module({
  imports: [FilmModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
