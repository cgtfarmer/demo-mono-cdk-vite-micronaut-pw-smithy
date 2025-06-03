package com.cgtfarmer.app.application.service;

import com.cgtfarmer.app.adapter.activity.exception.ResourceNotFoundException;
import com.cgtfarmer.app.application.port.in.CreateUserUseCase;
import com.cgtfarmer.app.application.port.in.DestroyUserUseCase;
import com.cgtfarmer.app.application.port.in.GetUserUseCase;
import com.cgtfarmer.app.application.port.in.ListUsersUseCase;
import com.cgtfarmer.app.application.port.in.UpdateUserUseCase;
import com.cgtfarmer.app.application.port.out.UserRepository;
import com.cgtfarmer.app.domain.model.User;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import java.util.List;
import java.util.UUID;

@Singleton
public final class UserService implements CreateUserUseCase, UpdateUserUseCase,
    DestroyUserUseCase, GetUserUseCase, ListUsersUseCase {

  private final UserRepository userRepository;

  @Inject
  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public List<User> listUsers() {
    return this.userRepository.getAll();
  }

  @Override
  public User getUser(UUID id) {
    return this.userRepository.get(id)
        .orElseThrow(() -> new ResourceNotFoundException(User.class, id));
  }

  @Override
  public User createUser(User user) {
    return this.userRepository.put(user);
  }

  @Override
  public User updateUser(User user) {
    User result = this.getUser(user.getId());

    return this.userRepository.put(user);
  }

  @Override
  public boolean destroyUser(UUID id) {
    return this.userRepository.destroy(id);
  }
}
