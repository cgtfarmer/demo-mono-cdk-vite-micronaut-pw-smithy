package com.cgtfarmer.app.lib.accessor.file;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public final class FilesystemFileAccessor implements FileAccessor {

  @Override
  public byte[] get(String filepath) throws FileAccessException {
    byte[] fileContents;

    try {
      fileContents = Files.readAllBytes(Path.of(filepath));
    } catch (IOException e) {
      // System.err.println(e.getStackTrace());
      throw new FileAccessException(e.getLocalizedMessage());
    }

    return fileContents;
  }

  @Override
  public String getAsString(String filepath) throws FileAccessException {
    byte[] fileContents = this.get(filepath);

    return new String(fileContents, StandardCharsets.UTF_8);
  }

  @Override
  public void put(String filepath, byte[] fileContents)
      throws FileAccessException {

    try {
      Files.write(Path.of(filepath), fileContents);
    } catch (IOException e) {
      // System.err.println(e.getStackTrace());
      throw new FileAccessException(e.getLocalizedMessage());
    }
  }

  @Override
  public void put(String filepath, String fileContents)
      throws FileAccessException {
    this.put(filepath, fileContents.getBytes(StandardCharsets.UTF_8));
  }

  @Override
  public void destroy(String filepath) throws FileAccessException {

    try {
      Files.delete(Path.of(filepath));
    } catch (IOException e) {
      // System.err.println(e.getStackTrace());
      throw new FileAccessException(e.getLocalizedMessage());
    }
  }
}
