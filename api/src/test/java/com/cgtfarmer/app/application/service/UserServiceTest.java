package com.cgtfarmer.app.application.service;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Tag;

@MicronautTest
@Tag("system")
public final class UserServiceTest {

  // private final UserService userService;

  // @Inject
  // public UserServiceTest(UserService userService) {
  // this.userService = userService;
  // }

  // @Test
  // void thingy() {
  // User createdUser = this.userService.createUser(
  // User.builder()
  // .firstName("John")
  // .lastName("Doe")
  // .age(32)
  // .weight(185.3f)
  // .smoker(true)
  // .build()
  // );

  // assertTrue(
  // StringUtils.isNotBlank(
  // createdUser.getId()
  // .toString()
  // )
  // );

  // User foundUser = this.userService.getUser(createdUser.getId());

  // assertEquals(createdUser.getId(), foundUser.getId());
  // }
}
