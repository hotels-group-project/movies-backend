import { Body, Controller, Get, HttpCode, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './interfaces/auth/log-in.dto';
import { RegistrationDto } from './interfaces/auth/registration.dto';
import { AuthResponse } from './interfaces/auth/token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './guards/role-auth.decorator';
import { RolesGuard } from './guards/role.guard';

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly client : ClientProxy) {}  
    
    @ApiTags('Auth')
    @ApiResponse({ 
        status: 200, 
        description: 'Return object with jwt token on code 200 and error message on code 400',
        type: AuthResponse
    })
    @Post('/login')    
    @HttpCode(200)
    login(@Body() loginDto : LoginDto){          
        return this.client.send('login', loginDto);                        
    }

    @ApiTags('Auth')
    @ApiResponse({ 
        status: 200, 
        description: 'Return object with jwt token on code 200 and error message on code 400',
        type: AuthResponse
    })    
    @Post('/registration')
    @HttpCode(200)
    registration(@Body() registrationDto : RegistrationDto){                                  
      return this.client.send('registration', registrationDto);
    }

    @ApiTags('Auth')
    @ApiResponse({ 
        status: 200, 
        description: 'Status 200 for authorized users',        
    })    
    @ApiResponse({ 
        status: 401, 
        description: 'Status 401 for not authorized users',
    })    
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('/secret')
    secretPlace(){
       return {message: "Secret place for register users only"} ;
    }    

    @ApiTags('Auth')
    @ApiResponse({ 
        status: 200, 
        description: 'Status 200 for admin',        
    })    
    @ApiResponse({ 
        status: 401, 
        description: 'Status 401 for not authorized users',
    })    
    @ApiResponse({ 
        status: 403, 
        description: 'Status 403 for not admin',
    })        
    @ApiBearerAuth()
    @Roles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/adminSecret')
    secretPlaceForAdminsOnly() {
        return {message: "It looks like you are admin!!!"} ;
    }
}