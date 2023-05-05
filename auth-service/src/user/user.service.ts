import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { AddUserDto } from './dto/add_user.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userRepository : typeof User,){}
    
    async createUser(createUserDto : AddUserDto){                
        const user = await this.userRepository.create(createUserDto);                           
        return user;
    }

    async getUserByLogin(login : string){
        const user = this.userRepository.findOne({ where : { login : login} });
        return user;
    }

    async getUserByEmail(email : string){
        const user = this.userRepository.findOne({ where : { email : email} });
        return user;
    }
}