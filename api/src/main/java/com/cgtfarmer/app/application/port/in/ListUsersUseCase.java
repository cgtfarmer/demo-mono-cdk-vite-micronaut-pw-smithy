package com.cgtfarmer.app.application.port.in;

import com.cgtfarmer.app.domain.model.User;
import java.util.List;

public interface ListUsersUseCase {

  public List<User> listUsers();
}
