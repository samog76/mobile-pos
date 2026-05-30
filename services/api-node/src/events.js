import { Kafka } from 'kafkajs'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'

export async function publishKafka(topic, payload) {
  if (!process.env.KAFKA_BROKER) return
  const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] })
  const producer = kafka.producer()
  try {
    await producer.connect()
    await producer.send({ topic, messages: [{ value: JSON.stringify(payload) }] })
  } catch (error) {
    console.warn('kafka publish failed', error.message)
  } finally {
    await producer.disconnect().catch(() => {})
  }
}

export async function enqueueJob(payload) {
  if (!process.env.SQS_QUEUE_URL) return
  const client = new SQSClient({
    region: 'us-east-1',
    endpoint: process.env.SQS_ENDPOINT,
    credentials: { accessKeyId: 'test', secretAccessKey: 'test' }
  })
  try {
    await client.send(new SendMessageCommand({ QueueUrl: process.env.SQS_QUEUE_URL, MessageBody: JSON.stringify(payload) }))
  } catch (error) {
    console.warn('sqs enqueue failed', error.message)
  }
}
