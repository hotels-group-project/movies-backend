import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, {    cors: { origin: 'http://localhost:3000', credentials: true }
  });

  const config = new DocumentBuilder()
    .setTitle('Films API')
    .setDescription('The films API description')
    .setVersion('1.0')
    .addTag('')
    .addBearerAuth()    
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
