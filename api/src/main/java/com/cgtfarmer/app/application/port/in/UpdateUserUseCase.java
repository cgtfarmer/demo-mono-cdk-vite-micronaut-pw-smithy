package com.cgtfarmer.app.application.port.in;

import com.cgtfarmer.app.domain.model.User;

public interface UpdateUserUseCase {

  public User updateUser(User user);
}
