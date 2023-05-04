import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports : [
    JwtModule.register({
      secret : 'Secret',      
      signOptions : {
        expiresIn : '24h'
      }
    }),
    forwardRef(() => UserModule),    
  ],
  exports : [
    AuthService
  ]
})
export class AuthModule {}
