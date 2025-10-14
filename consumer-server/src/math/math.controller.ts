import { Logger, Controller } from '@nestjs/common';
import { Client, MessagePattern, Transport } from '@nestjs/microservices';

@Controller('math')
export class MathController {
  private readonly logger = new Logger(MathController.name, { timestamp: true });

  @MessagePattern('math.sum')
  async accumulate(data: number[]): Promise<number> {
    
    // simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));

    this.logger.log(`Accumulating numbers: ${data.join(', ')}`);
    const sum = (data || []).reduce((a, b) => a + b);
    this.logger.log(`sum: ${sum}`);
    return sum;
  }
}
