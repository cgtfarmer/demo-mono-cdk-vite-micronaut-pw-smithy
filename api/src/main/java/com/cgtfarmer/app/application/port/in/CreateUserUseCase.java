package com.cgtfarmer.app.application.port.in;

import com.cgtfarmer.app.domain.model.User;

public interface CreateUserUseCase {

  public User createUser(User user);
}
