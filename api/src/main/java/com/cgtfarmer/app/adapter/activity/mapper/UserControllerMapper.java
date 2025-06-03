package com.cgtfarmer.app.adapter.activity.mapper;

import com.cgtfarmer.app.domain.model.User;
import com.smithy.model.UserDto;
import jakarta.inject.Singleton;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;

@Singleton
public final class UserControllerMapper {

  public List<UserDto> mapToDto(List<User> users) {
    return users.stream()
        .map(user -> {
          return UserDto.builder()
              .userId(
                  user.getId()
                      .toString()
              )
              .firstName(user.getFirstName())
              .lastName(user.getLastName())
              .age(BigDecimal.valueOf(user.getAge()))
              .weight(user.getWeight())
              .smoker(user.isSmoker())
              .build();
        })
        .toList();
  }

  public UserDto mapToDto(User user) {
    String id = Objects.isNull(user.getId())
        ? null
        : user.getId()
            .toString();

    return UserDto.builder()
        .userId(id)
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .age(BigDecimal.valueOf(user.getAge()))
        .weight(user.getWeight())
        .smoker(user.isSmoker())
        .build();
  }

  public User mapToModel(UserDto dto) {
    UUID id = null;

    if (StringUtils.isNotBlank(dto.getUserId())) {
      id = UUID.fromString(dto.getUserId());
    }

    return User.builder()
        .id(id)
        .firstName(dto.getFirstName())
        .lastName(dto.getLastName())
        .age(
            dto.getAge()
                .intValue()
        )
        .weight(dto.getWeight())
        .smoker(dto.getSmoker())
        .build();
  }
}

// UserDto dto = new UserDto(user.getFirstName());
// dto.setUserId(user.getId());
// dto.setLastName(user.getLastName());
// dto.setAge(user.getAge());
// dto.setWeight(user.getWeight());
// dto.setSmoker(user.isSmoker());
// return dto;

// UserDto dto = new UserDto(
// user.getId(),
// user.getFirstName(),
// user.getLastName(),
// user.getAge(),
// user.getWeight(),
// user.isSmoker()
// );
