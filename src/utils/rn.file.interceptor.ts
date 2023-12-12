// upload.interceptor.ts

import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as Busboy from 'busboy';

export class UploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return new Observable((observer) => {
      const busboy = new Busboy({ headers: request.headers });

      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const buffer: Buffer[] = [];

        file.on('data', (data) => {
          buffer.push(data);
        });

        file.on('end', () => {
          const fileBuffer = Buffer.concat(buffer);
          request.file = {
            fieldname,
            originalname: filename,
            encoding,
            mimetype,
            buffer: fileBuffer,
          };
          observer.next(null);
          observer.complete();
        });
      });

      busboy.on('finish', () => {
        next.handle();
      });

      busboy.end(request.raw);

      response.on('finish', () => {
        if (!response.headersSent) {
          observer.complete();
        }
      });
    });
  }
}
