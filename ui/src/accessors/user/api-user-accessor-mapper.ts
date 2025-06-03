import { UserDto } from '@cgtfarmer/user-service-client';
import { User } from '../../models/user';

export class ApiUserAccessorMapper {
  public mapToDto(model: User): UserDto {
    return {
      userId: model.id,
      firstName: model.firstName,
      lastName: model.lastName,
      age: Number(model.age),
      weight: Number(model.weight),
      smoker: model.smoker
    };
  }

  public mapAllToModel(dtos: UserDto[] | undefined): User[] {
    if (!dtos) return [];

    return dtos.map(dto => this.mapToModel(dto));
  }

  public mapToModel(dto: UserDto): User {
    return {
      id: dto.userId ?? '',
      firstName: dto.firstName ?? '',
      lastName: dto.lastName ?? '',
      age: dto.age ? dto.age.toString() : '',
      weight: dto.weight ? dto.weight.toString() : '',
      smoker: dto.smoker ?? false
    };
  }
}
