package com.cgtfarmer.app.application.port.in;

import com.cgtfarmer.app.domain.model.User;
import java.util.UUID;

public interface GetUserUseCase {

  public User getUser(UUID id);
}
