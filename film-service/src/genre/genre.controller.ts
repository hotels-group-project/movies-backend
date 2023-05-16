import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GenreService } from './genre.service';

@Controller()
export class GenreController {
    constructor (private readonly genreService: GenreService) {}

    @MessagePattern('get_genres')
    getAllGenres() : Promise<any[]> {
        const result = this.genreService.getAllGenres();        
        return result;
  }  
}
