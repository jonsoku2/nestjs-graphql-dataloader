import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entitiy';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class LoginInput extends PickType(User, ['email']) {
  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @Length(4, 255)
  password: string;
}

@ObjectType()
export class LoginOutput {
  @Field((type) => String)
  token: string;
}
