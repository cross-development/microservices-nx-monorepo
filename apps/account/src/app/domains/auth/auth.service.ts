import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@in-touch/interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  public async register({ email, password, displayName }: RegisterDto): Promise<{ email: string }> {
    const user = await this.userRepository.findUser(email);

    if (user) {
      throw new HttpException('User is already exist', HttpStatus.BAD_REQUEST);
    }

    const newUserEntity = await new UserEntity({
      email,
      displayName,
      passwordHash: '',
      role: UserRole.Student,
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);

    return { email: newUser.email };
  }

  public async login(id: string) {
    const accessToken = await this.jwtService.signAsync({ id });

    return { access_token: accessToken };
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);

    if (!user) {
      throw new HttpException('Email or password is not valid', HttpStatus.BAD_REQUEST);
    }

    const userEntity = new UserEntity(user);

    const isPasswordCorrect = await userEntity.validatePassword(password);

    if (!isPasswordCorrect) {
      throw new HttpException('Email or password is not valid', HttpStatus.BAD_REQUEST);
    }

    return { id: user._id };
  }
}
