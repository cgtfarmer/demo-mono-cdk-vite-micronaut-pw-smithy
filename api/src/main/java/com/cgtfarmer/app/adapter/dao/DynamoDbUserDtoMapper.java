package com.cgtfarmer.app.adapter.dao;

import com.cgtfarmer.app.domain.model.User;
import jakarta.inject.Singleton;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Singleton
public final class DynamoDbUserDtoMapper {

  public DynamoDbUserDto mapToDto(User user) {
    if (Objects.isNull(user))
      return null;

    String id = null;

    if (!Objects.isNull(user.getId())) {
      id = user.getId()
          .toString();
    }

    return DynamoDbUserDto.builder()
        .id(id)
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .age(user.getAge())
        .weight(user.getWeight())
        .smoker(user.isSmoker())
        .build();
  }

  public List<User> mapAllToModel(List<DynamoDbUserDto> users) {
    return users.stream()
        .map(user -> this.mapToModel(user))
        .toList();
  }

  public User mapToModel(DynamoDbUserDto dto) {
    if (Objects.isNull(dto))
      return null;

    return User.builder()
        .id(UUID.fromString(dto.getId()))
        .firstName(dto.getFirstName())
        .lastName(dto.getLastName())
        .age(dto.getAge())
        .weight(dto.getWeight())
        .smoker(dto.isSmoker())
        .build();
  }
}
