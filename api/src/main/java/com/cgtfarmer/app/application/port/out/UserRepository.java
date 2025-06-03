package com.cgtfarmer.app.application.port.out;

import com.cgtfarmer.app.domain.model.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {

  public Optional<User> get(UUID id);

  public List<User> getAll();

  // public User create(User user);

  // public User update(User user);

  public User put(User user);

  public boolean destroy(UUID id);
}
