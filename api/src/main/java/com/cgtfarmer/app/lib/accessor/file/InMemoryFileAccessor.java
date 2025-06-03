package com.cgtfarmer.app.lib.accessor.file;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public final class InMemoryFileAccessor implements FileAccessor {

  private final Map<String, byte[]> files;

  public InMemoryFileAccessor() {
    files = new HashMap<>();
  }

  @Override
  public byte[] get(String filepath) throws FileAccessException {
    return this.files.get(filepath);
  }

  @Override
  public String getAsString(String filepath) throws FileAccessException {
    byte[] fileContents = this.get(filepath);

    return new String(fileContents, StandardCharsets.UTF_8);
  }

  @Override
  public void put(String filepath, byte[] fileContents)
      throws FileAccessException {
    this.files.put(filepath, fileContents);
  }

  @Override
  public void put(String filepath, String fileContents)
      throws FileAccessException {
    this.put(filepath, fileContents.getBytes(StandardCharsets.UTF_8));
  }

  @Override
  public void destroy(String filepath) throws FileAccessException {
    this.files.remove(filepath);
  }
}
