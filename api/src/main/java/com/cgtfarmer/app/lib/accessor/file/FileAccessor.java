package com.cgtfarmer.app.lib.accessor.file;

/**
 * Interface for accessing files.
 */
public interface FileAccessor {

  byte[] get(String filepath) throws FileAccessException;

  String getAsString(String filepath) throws FileAccessException;

  void put(String filepath, byte[] fileContents) throws FileAccessException;

  void put(String filepath, String fileContents) throws FileAccessException;

  public void destroy(String filepath) throws FileAccessException;
}
