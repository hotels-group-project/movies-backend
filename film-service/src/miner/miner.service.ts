import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MinerService {

    constructor(private readonly httpService: HttpService) {}

    mineFilms(){     
             
        let response = this.httpService.get('https://api.kinopoisk.dev/v1/movie/random');        
        //   headers: {
        //     'X-API-KEY' : 'RA09X00-G79418E-QRY1HJB-83G1GAF'
        //   }        

        console.log(response);
    
        return response;
      }
}
