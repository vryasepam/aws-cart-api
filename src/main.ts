import { Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';

import helmet from 'helmet';

import { AppModule } from './app.module';

const port = process.env.PORT || 4000;
let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.listen(port);
}
// bootstrap().then(() => {
//   console.log('App is running on %s port', port);
// });

async function bootstrapCloud() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event, context, callback) => {
  server = server ?? (await bootstrapCloud());

  return server(event, context, callback);
};