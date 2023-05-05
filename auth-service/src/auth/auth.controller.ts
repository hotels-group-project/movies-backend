import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';

@Controller()
export class AuthController {
    constructor(private authService : AuthService){}

    @MessagePattern('login')
    login(@Payload() loginDto : LoginDto){     
        return this.authService.login(loginDto);
    }

    @MessagePattern('registration')
    registration(@Payload() registrationDto : RegistrationDto){                
        return this.authService.registration(registrationDto);
    }
}