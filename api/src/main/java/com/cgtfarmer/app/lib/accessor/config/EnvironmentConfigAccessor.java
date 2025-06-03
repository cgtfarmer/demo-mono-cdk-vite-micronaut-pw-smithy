package com.cgtfarmer.app.lib.accessor.config;

public class EnvironmentConfigAccessor implements ConfigAccessor {

  public EnvironmentConfigAccessor() {
  }

  @Override
  public String get(String propertyName) {
    return System.getenv(propertyName);
  }
}
