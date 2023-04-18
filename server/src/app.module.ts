import { Module } from '@nestjs/common';
import { FilmController } from './film.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MineController } from './mine.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FILM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'film_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [FilmController, MineController],
  providers: [],
})
export class AppModule {}
