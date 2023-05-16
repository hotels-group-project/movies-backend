import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [  
    ConfigModule.forRoot({
    envFilePath: '.env'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'postgres',
           // 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123123',
      database: 'postgres',
      models: [],
      autoLoadModels: true
    }),
    AuthModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
