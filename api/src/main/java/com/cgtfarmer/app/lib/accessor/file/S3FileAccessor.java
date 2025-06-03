package com.cgtfarmer.app.lib.accessor.file;

import java.nio.charset.StandardCharsets;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

public final class S3FileAccessor implements FileAccessor {

  private final S3Client s3Client;

  private final String bucketName;

  public S3FileAccessor(S3Client s3Client, String bucketName) {
    this.s3Client = s3Client;
    this.bucketName = bucketName;
  }

  @Override
  public byte[] get(String filepath) throws FileAccessException {
    ResponseBytes<GetObjectResponse> response = s3Client.getObject(
        request -> request.bucket(bucketName)
            .key(filepath),
        ResponseTransformer.toBytes()
    );

    return response.asByteArray();
  }

  @Override
  public String getAsString(String filepath) throws FileAccessException {
    byte[] fileContents = this.get(filepath);

    return new String(fileContents, StandardCharsets.UTF_8);
  }

  @Override
  public void put(String filepath, byte[] fileContents)
      throws FileAccessException {
    this.s3Client.putObject(request -> {
      request.bucket(this.bucketName)
          .key(filepath);
    }, RequestBody.fromBytes(fileContents));
  }

  @Override
  public void put(String filepath, String fileContents)
      throws FileAccessException {
    this.put(filepath, fileContents.getBytes(StandardCharsets.UTF_8));
  }

  @Override
  public void destroy(String filepath) {
    s3Client.deleteObject(
        request -> request.bucket(this.bucketName)
            .key(filepath)
    );
  }
}
