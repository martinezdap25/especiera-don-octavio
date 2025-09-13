import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from 'dotenv';

dotenv.config();
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS 👇
  app.enableCors({
    origin: [
      'http://localhost:3000', // frontend local
      'https://especiera-don-octavio.vercel.app', // ejemplo en prod (ajustá según tu deploy)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Don octavio Especiera API's")
    .setDescription("Una API con productos varios de una tienda de especias")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(parseInt(process.env.PORT || '3000'));
}
bootstrap();
