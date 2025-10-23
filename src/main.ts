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

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
  // Optional: console.log the exact base
  // console.log(`🚀 API ready on http://localhost:${process.env.PORT ?? 3000} (docs at /docs)`);
}
bootstrap();
