package com.cgtfarmer.app.adapter.activity;

import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import org.junit.jupiter.api.Tag;

@MicronautTest
@Tag("system")
public final class UserControllerTest {

  // private final UserController controller;

  // @Inject
  // public UserControllerTest(UserController controller) {
  // this.controller = controller;
  // }

  // @Test
  // void thingy1() throws Exception {
  // this.controller.getAll(null);
  // }

  // @Test
  // void thingy2() throws Exception {
  // CreateUserRequest createUserRequest = new CreateUserRequest(
  // new UserDto(null, "John", "Doe", 32, 185.3f, true)
  // );

  // CreateUserResponse createUserResponse =
  // this.controller.create(createUserRequest);

  // assertTrue(
  // StringUtils.isNotBlank(
  // createUserResponse.user()
  // .id()
  // .toString()
  // )
  // );

  // GetUserResponse getUserResponse = this.controller.get(
  // new GetUserRequest(
  // createUserResponse.user()
  // .id()
  // )
  // );

  // assertTrue(
  // StringUtils.isNotBlank(
  // getUserResponse.user()
  // .id()
  // .toString()
  // )
  // );

  // assertEquals(
  // createUserResponse.user()
  // .id(),
  // getUserResponse.user()
  // .id()
  // );
  // }
}
