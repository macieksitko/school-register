import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default (app: NestExpressApplication) => {
  const config = new DocumentBuilder()
    .setTitle('REST API Docs')
    .setDescription('School Register REST API Documentation')
    .setVersion('0.0.1')
    .addTag('school_register')
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT', in: 'Header' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'School Register API Docs',
  });
};
