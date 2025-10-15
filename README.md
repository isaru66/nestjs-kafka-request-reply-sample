# NestJS Kafka Request-Reply Pattern

A sample implementation demonstrating the **request-reply** pattern using **Apache Kafka** with **NestJS** microservices. This project showcases how to implement synchronous-like communication over Kafka's asynchronous messaging system.

## 📋 Overview

This repository contains a complete example of implementing a request-reply pattern with Kafka, consisting of:

- **Producer Client**: A NestJS HTTP application that sends requests to Kafka and waits for responses
- **Consumer Server**: A NestJS microservice that processes Kafka messages and sends back responses
- **Kafka Infrastructure**: Docker Compose setup with Kafka, Zookeeper, and Kafka UI

## 🏗️ Architecture

```
┌─────────────────────┐          ┌─────────────┐          ┌─────────────────────┐
│  Producer Client    │          │    Kafka    │          │  Consumer Server    │
│  (HTTP Server)      │──Request─▶   Topics    │──Request─▶  (Microservice)     │
│  Port: 3000         │          │             │          │                     │
│                     │◀─Reply───│   Broker    │◀─Reply───│  Message Handler    │
└─────────────────────┘          └─────────────┘          └─────────────────────┘
```

### Flow Example

1. Client makes HTTP GET request to `http://localhost:3000/math`
2. Producer generates an array of 5 random numbers
3. Producer sends the array to Kafka topic `math.sum` and subscribes to response
4. Consumer receives the message, calculates the sum
5. Consumer sends the result back through Kafka's reply mechanism
6. Producer receives the response and returns it to the HTTP client

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nestjs-kafka-request-reply
   ```

2. **Start Kafka infrastructure**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - Kafka broker on `localhost:9092`
   - Zookeeper on `localhost:2181`
   - Kafka UI on `http://localhost:8080`

3. **Install dependencies for both applications**
   
   For Consumer Server:
   ```bash
   cd consumer-server
   npm install
   ```

   For Producer Client:
   ```bash
   cd producer-client
   npm install
   ```

### Running the Applications

1. **Start the Consumer Server** (in one terminal)
   ```bash
   cd consumer-server
   npm run start:dev
   ```

2. **Start the Producer Client** (in another terminal)
   ```bash
   cd producer-client
   npm run start:dev
   ```

3. **Test the request-reply pattern**
   ```bash
   curl http://localhost:3000/math
   ```

   Expected response: A number representing the sum of 5 random numbers between 1 and 30.

## 📁 Project Structure

```
nestjs-kafka-request-reply/
├── docker-compose.yml           # Kafka infrastructure setup
├── producer-client/             # HTTP client that produces Kafka messages
│   ├── src/
│   │   ├── main.ts             # Application bootstrap
│   │   ├── app.module.ts       # Root module
│   │   └── math/
│   │       ├── math.module.ts  # Math module with Kafka client config
│   │       └── math.controller.ts  # HTTP endpoint + Kafka producer
│   └── package.json
└── consumer-server/             # Kafka consumer microservice
    ├── src/
    │   ├── main.ts             # Microservice bootstrap
    │   ├── app.module.ts       # Root module
    │   └── math/
    │       └── math.controller.ts  # Kafka message handler
    └── package.json
```

## 🔧 Configuration

### Producer Client (producer-client/src/math/math.module.ts)

```typescript
ClientsModule.register([
  {
    name: 'MATH_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'math',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'math-client-consumer'
      }
    }
  },
])
```

### Consumer Server (consumer-server/src/main.ts)

```typescript
{
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: process.env.KAFKA_GROUP_ID || 'consumer-group',
      allowAutoTopicCreation: true,
    },
  },
}
```

## 🎯 Key Features

- ✅ **Request-Reply Pattern**: Synchronous-like communication over async Kafka
- ✅ **NestJS Microservices**: Clean architecture with decorators
- ✅ **Observable Support**: RxJS Observables for reactive programming
- ✅ **Docker Compose**: Easy infrastructure setup
- ✅ **Kafka UI**: Visual monitoring of topics and messages
- ✅ **Auto Topic Creation**: Automatic topic creation when needed
- ✅ **TypeScript**: Full type safety

## 🧪 Testing

### Manual Testing

Visit the Kafka UI at `http://localhost:8080` to monitor:
- Topics created (`math.sum` and reply topics)
- Messages flowing through the system
- Consumer groups and their offsets

### API Testing

```bash
# Test the math sum endpoint
curl http://localhost:3000/math

# Expected: A number (sum of 5 random numbers)
# Example response: 87
```

### Running Unit Tests

Producer Client:
```bash
cd producer-client
npm test
```

Consumer Server:
```bash
cd consumer-server
npm test
```

## 📊 Kafka Topics

| Topic Pattern | Description |
|--------------|-------------|
| `math.sum` | Main topic for sending arrays to be summed |
| `math.sum.reply` | Auto-generated reply topic for responses |

## 🛠️ Development Scripts

Both `producer-client` and `consumer-server` have the same scripts:

```bash
npm run start          # Start in production mode
npm run start:dev      # Start in watch mode
npm run start:debug    # Start in debug mode
npm run build          # Build the application
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run lint           # Lint the code
npm run format         # Format the code with Prettier
```

## 🐳 Docker Services

The `docker-compose.yml` includes:

- **Zookeeper**: Coordinates Kafka brokers
- **Kafka**: Message broker (Confluent Platform 7.5.0)
- **Kafka UI**: Web interface for monitoring (port 8080)

## 📚 Technologies Used

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [KafkaJS](https://kafka.js.org/) - Modern Apache Kafka client for Node.js
- [Apache Kafka](https://kafka.apache.org/) - Distributed event streaming platform
- [RxJS](https://rxjs.dev/) - Reactive Extensions for JavaScript
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Docker](https://www.docker.com/) - Containerization platform

## 🤝 How It Works

### Producer Side (Client)

1. **Subscribe to Response Topic**: Before sending requests, the client subscribes to the response topic
   ```typescript
   this.client.subscribeToResponseOf('math.sum');
   ```

2. **Send Request**: Use the `send()` method which returns an Observable
   ```typescript
   return this.client.send<number>('math.sum', data);
   ```

3. **Receive Response**: The Observable completes when the response is received

### Consumer Side (Server)

1. **Message Pattern Decorator**: Define handlers with `@MessagePattern()`
   ```typescript
   @MessagePattern('math.sum')
   async accumulate(data: number[]): Promise<number> {
     return data.reduce((a, b) => a + b);
   }
   ```

2. **Process and Return**: The return value is automatically sent back through Kafka

## 🔍 Troubleshooting

### Kafka Connection Issues
- Ensure Docker containers are running: `docker-compose ps`
- Check Kafka logs: `docker-compose logs kafka`
- Verify port 9092 is not in use

### Messages Not Flowing
- Check Kafka UI at `http://localhost:8080`
- Verify both producer and consumer are running
- Check consumer group status in Kafka UI

### Port Conflicts
- Producer runs on port 3000 (configurable via `PORT` env variable)
- Kafka UI runs on port 8080
- Kafka broker on port 9092

## 📝 License

This project is licensed under the UNLICENSED license.

## 👤 Author

isaru66

## 🌟 Acknowledgments

This project demonstrates the power of combining NestJS microservices with Kafka's messaging capabilities to create scalable, decoupled applications.
