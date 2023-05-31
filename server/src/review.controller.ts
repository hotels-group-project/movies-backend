import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AddReviewDto } from './interfaces/review/add-review.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './guards/role-auth.decorator';

@Controller('review')
export class ReviewController {
    constructor(@Inject('FILM_SERVICE') private readonly client: ClientProxy) {}  

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiTags('Review')
    @ApiResponse({
        status: 200, 
        description: 'Add review to film, authorized users only!',    
        type: AddReviewDto
    })
    addReview(@Body() addReviewDto : AddReviewDto, @Req() request) {
        addReviewDto.user_id = request.user.user_id;        
        addReviewDto.user_name = request.user.login;    
        return this.client.send('add_review', addReviewDto);
    }

    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('/:id')
    @ApiTags('Review')
    @ApiResponse({
        status: 200, 
        description: 'delete review'
    })
    deleteReview(@Param('id') id : number) {        
        return this.client.send('delete_review', id);
    }
    
}