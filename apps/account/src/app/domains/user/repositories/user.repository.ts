import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  public async createUser(user: UserEntity): Promise<User> {
    const newUser = new this.userModel(user);

    return newUser.save();
  }

  public async findUser(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  public async deleteUser(email: string): Promise<void> {
    this.userModel.deleteOne({ email }).exec();
  }
}
