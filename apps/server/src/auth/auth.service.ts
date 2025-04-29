import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  async register(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      email,
      username,
      password: hashedPassword,
    };
    // Logic for user registration (dummy for now)
    return { message: 'User registered successfully', user };
  }

  login(createUserDto: CreateUserDto) {
    // Logic for login (dummy for now)
    return { message: 'Login successful', user: createUserDto };
  }
}
