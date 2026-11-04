import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq/rabbitmq.service.js';
import { ConfigModule } from '@nestjs/config';
import { PaymentQueueService } from './payment-queue/payment-queue.service.js';
import { PaymentConsumerService } from './payment-consumer/payment-consumer.service.js';

@Module({
  imports: [ConfigModule],
  providers: [RabbitmqService, PaymentQueueService, PaymentConsumerService]
})
export class EventsModule {}
