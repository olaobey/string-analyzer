"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('String Analyzer')
        .setDescription('REST API that analyzes strings and stores their computed properties')
        .setVersion('1.0')
        .build();
    const doc = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('/docs', app, doc);
    await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
    // Optional: console.log the exact base
    // console.log(`🚀 API ready on http://localhost:${process.env.PORT ?? 3000} (docs at /docs)`);
}
bootstrap();
