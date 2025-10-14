import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MathController } from './math.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'math',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'math-client-consumer'
          }
        }
      },
    ]),
  ],
  controllers: [MathController],
})
export class MathModule {}
