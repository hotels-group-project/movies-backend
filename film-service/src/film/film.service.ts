import { Injectable } from '@nestjs/common';

@Injectable()
export class FilmService {
  getFilmById(id: number): string {
    return `film with id ${id}`;
  }
}
