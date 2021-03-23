import {Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {JwtPayload} from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accesToken: string}> {
    const username = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const paylaod: JwtPayload = { username };
    const accesToken = await this.jwtService.sign(paylaod);

    return { accesToken };
  }
}
