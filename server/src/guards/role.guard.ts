import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "./role-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate{    
    
    constructor (protected jwtService : JwtService,
                 protected reflector : Reflector){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
                
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        
        if (!requiredRoles){            
            return true;
        }
                
        const req = context.switchToHttp().getRequest(); 
        try {                    
            const authHeader = req.headers.authorization;                        
            const bearer = authHeader.split(' ')[0];            
            const token = authHeader.split(' ')[1];            
            
            if (bearer !== 'Bearer' || !token){                
                throw new UnauthorizedException('Пользователь не авторизован');
            }
            
            const user = this.jwtService.verify(token);
            req.user = user;                    
            return requiredRoles.includes(user.role);

        } catch (e) {
            throw new HttpException('Доступ запрещен', HttpStatus.FORBIDDEN);
        }
    }
}