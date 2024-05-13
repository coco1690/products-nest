import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // PRIMER PASO DESPUES DE CONFIG LAS ENTIDADES
  app.setGlobalPrefix('api');

  // SEGUNDO PASO TOCA INSTALAR yarn add class-validator class-transformer LUEGO SI CONFIG EL GLOBALPIPES
  // EL TERCER PASO ES IR AL DTO CREATE-PRODUCTS 
  app.useGlobalPipes(
    new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true, })
  );

  await app.listen(3000);
}
bootstrap();
