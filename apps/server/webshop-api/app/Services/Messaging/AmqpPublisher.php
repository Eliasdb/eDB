<?php

namespace App\Services\Messaging;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

final class AmqpPublisher
{
    private string $exchange = 'edb.events';
    private string $queue = 'admin.orders';
    private string $routingKey = 'order.created.v1';

    public function publish(array $payload): void
    {
        $connection = new AMQPStreamConnection(
            host: env('AMQP_HOST', 'localhost'),
            port: (int) env('AMQP_PORT', 5672),
            user: env('AMQP_USER', 'dev'),
            password: env('AMQP_PASS', 'dev'),
            vhost: env('AMQP_VHOST', '/')
        );

        $channel = $connection->channel();

        // Declare exchange (topic)
        $channel->exchange_declare(
            $this->exchange,
            type: 'topic',
            passive: false,
            durable: true,
            auto_delete: false
        );

        // Declare queue
        $channel->queue_declare(
            $this->queue,
            passive: false,
            durable: true,
            exclusive: false,
            auto_delete: false
        );

        // Bind queue to exchange with routing key
        $channel->queue_bind($this->queue, $this->exchange, $this->routingKey);

        // Publish
        $message = new AMQPMessage(
            body: json_encode($payload, JSON_THROW_ON_ERROR),
            properties: [
                'content_type' => 'application/json',
                'delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT,
            ]
        );
        $channel->basic_publish($message, $this->exchange, $this->routingKey);

        $channel->close();
        $connection->close();
    }
}
