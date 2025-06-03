import { User } from '../../models/user';

export interface UserAccessor {
  fetchAll(): Promise<User[]>;

  fetch(userId: string): Promise<User | undefined>;

  create(user: User): Promise<User | undefined>;

  update(user: User): Promise<User | undefined>;

  destroy(userId: string): Promise<boolean>;
}
