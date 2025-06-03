package com.cgtfarmer.app.adapter.dao;

import com.cgtfarmer.app.application.port.out.UserRepository;
import com.cgtfarmer.app.domain.model.User;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.IntStream;

// @Singleton
public final class InMemoryUserRepository implements UserRepository {

  private final List<User> users;

  public InMemoryUserRepository() {
    this.users = new ArrayList<>();
  }

  @Override
  public Optional<User> get(UUID id) {
    return this.users.stream()
        .filter(
            e -> e.getId()
                .equals(id)
        )
        .findFirst();
  }

  @Override
  public List<User> getAll() {
    return users;
  }

  @Override
  public boolean destroy(UUID id) {
    Optional<User> user = this.get(id);

    if (user.isEmpty())
      return true;

    int index = this.users.indexOf(user.get());

    this.users.remove(index);

    return true;
  }

  @Override
  public User put(User user) {
    if (Objects.isNull(user.getId()))
      user.setId(UUID.randomUUID());

    int index = this.getUserIndex(user.getId());

    if (index < 0) {
      this.users.add(user);
      return user;
    }

    this.users.set(index, user);

    return user;
  }

  private int getUserIndex(UUID id) {
    if (Objects.isNull(id))
      return -1;

    return IntStream.range(0, this.users.size())
        .filter(
            i -> this.users.get(i)
                .getId()
                .equals(id)
        )
        .findFirst()
        .orElse(-1);
  }

  // @Override
  // public User create(User user) {
  // user.setId(UUID.randomUUID());

  // users.add(user);

  // return user;
  // }

  // @Override
  // public User update(User user) {
  // int index = IntStream.range(0, this.users.size())
  // .filter(
  // i -> this.users.get(i)
  // .getId()
  // .equals(user.getId())
  // )
  // .findFirst()
  // .orElse(-1);

  // if (index < 0)
  // return user;

  // this.users.set(index, user);

  // return user;
  // }
}
