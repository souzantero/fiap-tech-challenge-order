import { SNS } from 'aws-sdk';

export class AmazonSNSService {
  private static instance: AmazonSNSService;
  private constructor(public readonly sns: SNS = new SNS()) {}

  static getInstance(): AmazonSNSService {
    if (!AmazonSNSService.instance) {
      AmazonSNSService.instance = new AmazonSNSService();
    }

    return AmazonSNSService.instance;
  }
}
