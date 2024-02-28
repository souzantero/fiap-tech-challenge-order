import { SQS } from 'aws-sdk';

export class AmazonSQSService {
  private static instance: AmazonSQSService;
  private constructor(public readonly sqs: SQS = new SQS()) {}

  static getInstance(): AmazonSQSService {
    if (!AmazonSQSService.instance) {
      AmazonSQSService.instance = new AmazonSQSService();
    }

    return AmazonSQSService.instance;
  }
}
