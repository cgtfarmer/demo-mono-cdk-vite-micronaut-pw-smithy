package com.cgtfarmer.app.adapter.activity.exception;

import java.util.UUID;
import lombok.Getter;

public class ResourceNotFoundException extends RuntimeException {

  @Getter
  private final String resourceType;

  @Getter
  private final String resourceId;

  public ResourceNotFoundException(Class<?> type, UUID id) {
    super(
        String.format(
            "Resource Not Found (Type: %s, ID: %s)",
            type.getSimpleName(),
            id.toString()
        )
    );

    this.resourceType = type.getSimpleName();
    this.resourceId = id.toString();
  }
}
