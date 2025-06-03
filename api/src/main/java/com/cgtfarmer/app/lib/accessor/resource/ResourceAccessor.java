package com.cgtfarmer.app.lib.accessor.resource;

import com.cgtfarmer.app.lib.accessor.file.FileAccessException;

/**
 * Interface for accessing Java classpath resources.
 */
public interface ResourceAccessor {

  byte[] get(String filepath) throws FileAccessException;

  String getAsString(String filepath) throws FileAccessException;
}
