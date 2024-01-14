import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Access token is required',
          success: false,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (payload._id) {
        await this.cacheManager.set('user_payload', payload, {
          ttl: 100000000000, // this is for testing purpose
        });
      }
      console.log({ payload });

      console.log(request.sessionID, payload.sessionId);

      // Check if the session_id in the token matches the current session identifier
      if (payload.sessionId !== request.sessionID) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message:
              'Access token is expired or invalid for the current session',
            success: false,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Attach the user payload to the request
      request['user'] = payload;
    } catch (error) {
      console.log(error.message);

      if (error.name === 'TokenExpiredError') {
        // here we can user refresh token strategy as well
        let cachedPayload = await this.cacheManager.get('user_payload');
        let isLoggedIn = await this.cacheManager.get('isLoggedIn');

        console.log({ cachedPayload }, 'a', isLoggedIn);

        if (isLoggedIn) {
          request['user'] = cachedPayload;
          return true;
        }
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Access token is expired or invalid',
          success: false,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
