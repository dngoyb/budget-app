import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  register(createUserDto: CreateUserDto) {
    // Logic for user registration (dummy for now)
    return { message: 'User registered successfully', user: createUserDto };
  }

  login(createUserDto: CreateUserDto) {
    // Logic for login (dummy for now)
    return { message: 'Login successful', user: createUserDto };
  }
}
