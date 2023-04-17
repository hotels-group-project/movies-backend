import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Film } from '../film/film.model';
import { GenreService } from './genre.service';

@Controller('')
export class GenreController {

    constructor(private readonly genreService: GenreService) {}
    
    @MessagePattern('get_films_by_genre')
    getFilmsByGenre(@Payload() genre: string): Promise<Film[]> {
      return this.genreService.getFilmsByGenre(genre);
    }
}
