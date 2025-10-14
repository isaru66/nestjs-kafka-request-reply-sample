import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const groupId = process.env.KAFKA_GROUP_ID || 'consumer-group';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId,
          allowAutoTopicCreation: true,
        },
      },
    },
  );

  app.listen();
}
bootstrap();
