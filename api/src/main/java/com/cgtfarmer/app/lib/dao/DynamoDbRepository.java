package com.cgtfarmer.app.lib.dao;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.model.GetItemEnhancedRequest;
import software.amazon.awssdk.enhanced.dynamodb.model.PageIterable;

public final class DynamoDbRepository<E> {

  private final DynamoDbTable<E> table;

  public DynamoDbRepository(DynamoDbTable<E> table) {
    this.table = table;
  }

  public List<E> getAll() {
    PageIterable<E> pages = table.scan();
    return pages.items()
        .stream()
        .collect(Collectors.toList());
  }

  public Optional<E> get(Key key) {
    E item = table.getItem(
        GetItemEnhancedRequest.builder()
            .key(key)
            .build()
    );
    return Optional.ofNullable(item);
  }

  public void put(E entity) {
    table.putItem(entity);
  }

  public void destroy(Key key) {
    table.deleteItem(key);
  }
}
