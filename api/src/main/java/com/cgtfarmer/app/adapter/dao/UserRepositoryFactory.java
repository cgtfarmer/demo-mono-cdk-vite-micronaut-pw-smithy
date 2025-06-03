package com.cgtfarmer.app.adapter.dao;

import com.cgtfarmer.app.application.port.out.UserRepository;
import com.cgtfarmer.app.lib.dao.DynamoDbRepository;
import io.micronaut.context.annotation.Factory;
import io.micronaut.context.annotation.Requires;
import io.micronaut.context.annotation.Value;
import io.micronaut.context.env.Environment;
import jakarta.inject.Singleton;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

@Factory
public final class UserRepositoryFactory {

  @Singleton
  // @Primary
  @Requires(env = Environment.CLOUD)
  public UserRepository dynamoDbUserRepository(
      DynamoDbEnhancedClient ddbEnhancedClient,
      DynamoDbUserDtoMapper dynamoDbUserDtoMapper,
      @Value("${ddb.table.name}") String ddbTableName
  ) {
    TableSchema<DynamoDbUserDto> schema =
        TableSchema.fromBean(DynamoDbUserDto.class);

    DynamoDbTable<DynamoDbUserDto> table =
        ddbEnhancedClient.table(ddbTableName, schema);

    DynamoDbRepository<DynamoDbUserDto> dynamoDbRepository =
        new DynamoDbRepository<>(table);

    return new DynamoDbUserRepository(
        dynamoDbRepository,
        dynamoDbUserDtoMapper
    );
  }

  @Requires(notEnv = Environment.CLOUD)
  @Singleton
  public UserRepository inMemoryUserRepository() {
    return new InMemoryUserRepository();
  }
}
