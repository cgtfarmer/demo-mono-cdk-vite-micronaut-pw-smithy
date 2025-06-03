package com.cgtfarmer.app.domain.model;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public final class User {

  private UUID id;

  private String firstName;

  private String lastName;

  private int age;

  private float weight;

  private boolean smoker;
}
