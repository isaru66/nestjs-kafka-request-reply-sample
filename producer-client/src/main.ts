import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // This example contains a hybrid application (HTTP + KAFKA)
  const app = await NestFactory.create(AppModule);
  /*
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
    },
  }); */

  //await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
