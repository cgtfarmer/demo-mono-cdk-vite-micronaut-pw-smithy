package com.cgtfarmer.app.lib.accessor.resource;

import com.cgtfarmer.app.lib.accessor.file.FileAccessException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

public final class ResourceFileReader implements ResourceAccessor {

  private static final String FILE_ACCESS_EXCEPTION_MSG_FORMAT =
      "Resource: %s not found on classpath";

  @Override
  public byte[] get(String filepath) throws FileAccessException {
    byte[] bytes;

    try (
        InputStream inputStream = Thread.currentThread()
            .getContextClassLoader()
            .getResourceAsStream(filepath)
    ) {

      if (Objects.isNull(inputStream)) {
        throw new FileAccessException(
            String.format(FILE_ACCESS_EXCEPTION_MSG_FORMAT, filepath)
        );
      }

      bytes = inputStream.readAllBytes();
    } catch (IOException e) {
      throw new FileAccessException(
          String.format(FILE_ACCESS_EXCEPTION_MSG_FORMAT, filepath)
      );
    }

    return bytes;
  }

  @Override
  public String getAsString(String filepath) throws FileAccessException {
    byte[] fileContents = this.get(filepath);

    return new String(fileContents, StandardCharsets.UTF_8);
  }
}

/**
 * File reader for resources. Note: File resources located at src/main/resources
 * appear in the top level of the JAR after compilation. Therefore
 * `src/main/resources/file.txt` would be retrieved via `get("file.txt")`
 */
