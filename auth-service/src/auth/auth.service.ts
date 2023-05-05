import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { AuthResponse } from './dto/auth.res.dto';

@Injectable()
export class AuthService {
    constructor(private userService : UserService,                         
                private jwtService : JwtService){}
                
    async login(loginDto : LoginDto) : Promise<AuthResponse> {         
        try {   
            const user = await this.validateUser(loginDto);
            const token = await this.generateToken(user);
            return {
                code: 200,
                message: "success",
                token: token.token
            }
        } catch (e) {
            return {
                code: 400,
                message: e.message,
                token: null
            }
        }         
    }
    
    async registration(registrationDto : RegistrationDto) : Promise<AuthResponse> {                     

        if (await this.loginExists(registrationDto.login)){
            return {
                code: 400,
                message: 'Логин уже существует',
                token: null
            }
        }

        if (await this.emailExists(registrationDto.email)){
            return {
                code: 400,
                message: 'Email уже используется',
                token: null
            }
        }
        
        const salt = 5; 
        const hashPassword = await bcrypt.hash(registrationDto.password, salt);

        const user = await this.userService.createUser({...registrationDto, password : hashPassword, role : 'User'});
        
        const token = await this.generateToken(user);
        return {
            code: 200,
            message: "success",
            token: token.token
        }
    }

    private async loginExists(login : string){
        const candidate = await this.userService.getUserByLogin(login);
        if (candidate){
            return true;
        }

        return false;
    }

    private async emailExists(email : string){
        const candidate = await this.userService.getUserByEmail(email);
        if (candidate){
            return true;
        }

        return false;
    }
    
    private async generateToken(user : User){        
        const payload = {user_id : user.user_id, login : user.login, role : user.role};
        return {
            token : this.jwtService.sign(payload)
        }
    }

    private async validateUser(loginDto : LoginDto) {
        const user = await this.userService.getUserByLogin(loginDto.login);
        if (!user){
            throw new UnauthorizedException('Неверный логин');
        }        

        const passwordEquals = await bcrypt.compare(loginDto.password, user.password);
        if (!passwordEquals){
            throw new UnauthorizedException('Неверный пароль');
        }

        return user;
    }
}