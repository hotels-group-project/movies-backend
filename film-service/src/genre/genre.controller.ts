import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Film } from '../film/film.model';
import { GenreService } from './genre.service';

@Controller('')
export class GenreController {
}
