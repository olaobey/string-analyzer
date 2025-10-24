import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('String Analyzer')
    .setDescription('REST API that analyzes strings and stores their computed properties')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, doc);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
