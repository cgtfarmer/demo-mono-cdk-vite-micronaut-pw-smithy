package com.cgtfarmer.app.application.port.in;

import java.util.UUID;

public interface DestroyUserUseCase {

  public boolean destroyUser(UUID id);
}
