import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Extend the Passport AuthGuard and specify the 'jwt' strategy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // No additional logic is needed here for a basic JWT guard.
  // Passport handles the token extraction and validation using the JwtStrategy.
  // If validation fails (e.g., invalid token, expired token, user not found in validate method),
  // Passport will automatically throw an UnauthorizedException.
}
