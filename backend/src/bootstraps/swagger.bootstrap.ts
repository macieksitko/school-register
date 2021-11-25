import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default (app: NestExpressApplication) => {
  const config = new DocumentBuilder()
    .setTitle('School registry')
    .setDescription('School registry API description')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
};
