import { Controller, Get, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { ClientKafkaProxy } from '@nestjs/microservices';

@Controller('math')
export class MathController {

  constructor(@Inject("MATH_SERVICE") private readonly client: ClientKafkaProxy) {}

  onModuleInit() {
    this.client.subscribeToResponseOf('math.sum');
  }

  @Get()
  execute(): Observable<number> {
    const kafka_topic = 'math.sum';

    // random array of 5 numbers between 1 and 30
    const data = Array.from({ length: 5 }, () => Math.floor(Math.random() * 30) + 1);

    // send data to kafka topic and expect a number in response
    return this.client.send<number>(kafka_topic, data);
  }
}
