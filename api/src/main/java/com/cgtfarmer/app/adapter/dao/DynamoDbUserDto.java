package com.cgtfarmer.app.adapter.dao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

// @DynamoDbImmutable(builder = DynamoDbUserDto.DynamoDbUserDtoBuilder.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamoDbBean
public final class DynamoDbUserDto {

  @Getter(onMethod_ = @DynamoDbPartitionKey)
  private String id;

  private String firstName;

  private String lastName;

  private int age;

  private float weight;

  private boolean smoker;
}
