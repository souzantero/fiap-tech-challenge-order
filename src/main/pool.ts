import { SQS } from 'aws-sdk';
import { environment } from './configuration/environment';
import { AmazonSQSPool } from './messaging/amazonsqs/amazonsqs-pool';
import { onPaymentApproved, onPaymentRejected } from './lambda';

export const pool = () => {
  const sqs = new SQS();
  const { paymentApprovedSQSQueueUrl, paymentRejectedSQSQueueUrl } =
    environment;
  const paymentApprovedPool = new AmazonSQSPool(
    sqs,
    paymentApprovedSQSQueueUrl,
  );
  const paymentRejectedPool = new AmazonSQSPool(
    sqs,
    paymentRejectedSQSQueueUrl,
  );

  const receivePaymentApproved = () => {
    paymentApprovedPool.receive(onPaymentApproved).catch(console.error);
  };

  const receivePaymentRejected = () => {
    paymentRejectedPool.receive(onPaymentRejected).catch(console.error);
  };

  receivePaymentApproved();
  receivePaymentRejected();

  setInterval(receivePaymentRejected, 10000);
  setInterval(receivePaymentApproved, 10000);
};
