import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PaymentQueueService } from '../payment-queue/payment-queue.service.js';
import { PaymentOrderMessage } from '../payment-queue.interface.js';

// PaymentConsumerService will contain all the business logic
// will validate received messages
// will process payments
// will handle business errors
// will log payments transactions

@Injectable()
export class PaymentConsumerService implements OnModuleInit{

    private readonly logger = new Logger(PaymentConsumerService.name)

    constructor (private readonly paymentQueueService: PaymentQueueService) {}

    // turn on the module so it can listen
    async onModuleInit () {
        this.logger.log('Starting Payment Consumer Service')
        await this.startConsuming();
    }

    async startConsuming () {
        try {

            this.logger.log('Starting to consume payment orders from queue')

            // registers the callback to process each message
            // bind(this) ensures that 'this' inside the callback refers to this class
            await this.paymentQueueService.consumePaymentOrders(
                this.processPaymentOrder.bind(this)
            )

            this.logger.log('Payment Consumer Service started successfully')

        } catch (error) {
            this.logger.error('Failed to start consuming payment orders: ', error)
        }
    }

    private async processPaymentOrder (message: PaymentOrderMessage): Promise <void> {
        try {
            
            this.logger.log(
                `Processing payment order: ` +
                `eventId=${message.eventId}` +
                `orderId=${message.orderId}` +
                `userId=${message.userId}` +
                `amount=${message.amountInCents}` 
            )

            if (!this.validateMessage(message)) {
                this.logger.error('Invalid payment message received')
                return
            }

            this.logger.log('Payment order received and validated')

        } catch (error) {
            this.logger.error(`Failed to process payment for order: ${message.orderId}`, error)
            throw error
        }
    }

    private validateMessage (message: PaymentOrderMessage): boolean {
        
        if (!message.eventId) {
            this.logger.error('Missing eventId in payment message');
            return false
        }

        if (!message.orderId) {
            this.logger.error('Missing orderId in payment message');
            return false
        }

        if (!message.userId) {
            this.logger.error('Missing userId in payment message');
            return false
            
        }

        if (!message.amountInCents || message.amountInCents <= 0) {
            this.logger.error('Invalid amout in payment message');
            return false
        }

        if (!message.paymentMethod) {
            this.logger.error('Missing paymentMethod in payment message');
            return false
        }

        if (!message.items || message.items.length <= 0) {
            this.logger.error('No items in payment message');
            return false
        }

        return true

    }

}
