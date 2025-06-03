package com.cgtfarmer.app.adapter.dao;

import io.micronaut.context.annotation.Factory;
import io.micronaut.context.annotation.Requires;
import io.micronaut.context.env.Environment;
import jakarta.inject.Singleton;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

@Factory
@Requires(env = Environment.CLOUD)
public final class DynamoDbClientFactory {

  @Singleton
  public DynamoDbEnhancedClient dynamoDbEnhancedClient() {
    DynamoDbClient ddbClient = DynamoDbClient.builder()
        // .region(Region.US_EAST_1)
        .build();

    return DynamoDbEnhancedClient.builder()
        .dynamoDbClient(ddbClient)
        .build();
  }
}
