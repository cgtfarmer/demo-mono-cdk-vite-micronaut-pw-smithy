package com.cgtfarmer.app.adapter.dao;

import com.cgtfarmer.app.application.port.out.UserRepository;
import com.cgtfarmer.app.domain.model.User;
import com.cgtfarmer.app.lib.dao.DynamoDbRepository;
import jakarta.inject.Inject;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import software.amazon.awssdk.enhanced.dynamodb.Key;

// @Requires(env = "DEPLOYED")
public final class DynamoDbUserRepository implements UserRepository {

  private final DynamoDbRepository<DynamoDbUserDto> repository;

  private final DynamoDbUserDtoMapper mapper;

  @Inject
  public DynamoDbUserRepository(
      DynamoDbRepository<DynamoDbUserDto> repository,
      DynamoDbUserDtoMapper mapper
  ) {
    this.repository = repository;
    this.mapper = mapper;
  }

  @Override
  public List<User> getAll() {
    return this.mapper.mapAllToModel(this.repository.getAll());
  }

  @Override
  public Optional<User> get(UUID id) {
    Key key = Key.builder()
        .partitionValue(id.toString())
        .build();

    Optional<DynamoDbUserDto> user = this.repository.get(key);

    return Optional.ofNullable(this.mapper.mapToModel(user.orElse(null)));
  }

  @Override
  public User put(User user) {
    if (Objects.isNull(user.getId()))
      user.setId(UUID.randomUUID());

    this.repository.put(this.mapper.mapToDto(user));

    return user;
  }

  @Override
  public boolean destroy(UUID id) {
    Key key = Key.builder()
        .partitionValue(id.toString())
        .build();

    this.repository.destroy(key);

    return true;
  }

  // @Override
  // public User create(User user) {
  // user.setId(UUID.randomUUID());

  // return this.update(user);
  // }

  // @Override
  // public User update(User user) {
  // this.repository.put(this.mapper.mapToDto(user));

  // return user;
  // }
}
