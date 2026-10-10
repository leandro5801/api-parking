import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Parking API')
    .setDescription(
      'API RESTful para la gestión de un parking: reservas, ocupación, usuarios y logs de actividad.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig), {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = app.get(ConfigService).get<number>('PORT', 3000);
  await app.listen(port);
  Logger.log(`API:     http://localhost:${port}/api`, 'Bootstrap');
  Logger.log(`Swagger: http://localhost:${port}/docs`, 'Bootstrap');
}
bootstrap();
