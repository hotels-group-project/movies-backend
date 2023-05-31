import { Body, Controller, Get, HttpCode, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddGenreDto } from './interfaces/genre/add-genre.dto';
import { UpdateGenreDto } from './interfaces/genre/update-genre.dto';
import { GetGenreResponse } from './interfaces/genre/get-genre.dto';
import { Observable } from 'rxjs';
import { Roles } from './guards/role-auth.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';

@Controller('genres')
export class GenresController {
    constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}  

    @Get()
    @ApiTags('Genre')
    @ApiResponse({
        status: 200, 
        description: 'Return all genres in db',    
        type: [GetGenreResponse]
    })
    getAllGenres(): Observable<GetGenreResponse[]> {
      return this.client.send('get_genres', '');
    }
    
    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()  
    @ApiTags('Genre')
    @ApiResponse({
        status: 200, 
        description: 'Return created genre', 
        type: GetGenreResponse           
    })      
    addGenre(@Body() addGenreDto : AddGenreDto){          
        return this.client.send('add_genre', addGenreDto);
    }

    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put()  
    @ApiTags('Genre')
    @ApiResponse({
        status: 200, 
        description: 'Return updated genre',            
        type: GetGenreResponse
    })      
    updateGenre(@Body() updateGenreDto : UpdateGenreDto){          
        return this.client.send('update_genre', updateGenreDto);
    }    
}
