import { CreateUserCommand, DestroyUserCommand, GetUserCommand, ListUsersCommand, PutUserCommand, UserServiceClient } from '@cgtfarmer/user-service-client';
import { User } from '../../models/user';
import { UserAccessor } from './user-accessor';
import { ApiUserAccessorMapper } from './api-user-accessor-mapper';

export default class ApiUserAccessor implements UserAccessor {

  constructor(
    private readonly userServiceClient: UserServiceClient,
    private readonly mapper: ApiUserAccessorMapper
  ) {
  }

  public async fetchAll(): Promise<User[]> {
    const response = await this.userServiceClient.send(
      new ListUsersCommand()
    );

    return this.mapper.mapAllToModel(response.users);
  }

  public async fetch(userId: string): Promise<User | undefined> {
    const response = await this.userServiceClient.send(
      new GetUserCommand({ userId: userId })
    );

    if (!response.user) return undefined;

    return this.mapper.mapToModel(response.user);
  }

  public async create(user: User): Promise<User | undefined> {
    const userDto = this.mapper.mapToDto(user);
    const request = new CreateUserCommand({ user: userDto });

    const response = await this.userServiceClient.send(request);

    if (!response.user) return undefined;

    return this.mapper.mapToModel(response.user);
  }

  public async update(user: User): Promise<User | undefined> {
    const userDto = this.mapper.mapToDto(user);

    const request = new PutUserCommand({
      userId: user.id,
      user: userDto
    });

    const response = await this.userServiceClient.send(request);

    if (!response.user) return undefined;

    return this.mapper.mapToModel(response.user);
  }

  public async destroy(userId: string): Promise<boolean> {
    const response = await this.userServiceClient.send(
      new DestroyUserCommand({ userId: userId })
    );

    if (!response.success) return false;

    return response.success;
  }
}
