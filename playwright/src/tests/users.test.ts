import { test, expect } from '../config/playwright-extensions';
import { CreateUserCommand, DestroyUserCommand, GetUserCommand, ListUsersCommand, PutUserCommand } from '@cgtfarmer/user-service-client';

// Rationale: Including the "new user" fixture causes it to be created, which
// is necessary for the test to discover if users will actually be retrieved
// eslint-disable-next-line @typescript-eslint/no-unused-vars
test("retrieve users", async ({ userServiceClient, newUserWithDefaultParams }) => {
  const response = await userServiceClient.send(
    new ListUsersCommand()
  );

  expect(response.$metadata.httpStatusCode).toEqual(200);

  expect(response.users?.length).toBeGreaterThan(0);
});

test("create user", async ({ userServiceClient }) => {
  const request = new CreateUserCommand({
    user: {
      firstName: "John",
      lastName: "Doe",
      age: 32,
      weight: 185.3,
      smoker: false
    }
  });

  const response = await userServiceClient.send(request);

  expect(response.$metadata.httpStatusCode).toEqual(201);

  expect(response.user?.userId?.length).toBeGreaterThan(0);
  expect(response.user?.firstName).toBe(request.input.user?.firstName);
  expect(response.user?.lastName).toBe(request.input.user?.lastName);
  expect(response.user?.age).toBe(request.input.user?.age);
  expect(response.user?.weight).toBe(request.input.user?.weight);
  expect(response.user?.smoker).toBe(request.input.user?.smoker);
});

test("retrieve user", async ({ userServiceClient, newUserWithDefaultParams }) => {
  const response = await userServiceClient.send(
    new GetUserCommand({ userId: newUserWithDefaultParams.userId })
  );

  // console.log(getUserResponse);

  expect(response.$metadata.httpStatusCode).toEqual(200);

  expect(response.user?.userId).toBe(newUserWithDefaultParams.userId);
});

test("update user", async ({ userServiceClient, newUserWithDefaultParams }) => {
  const newFirstName = "Test";

  const request = new PutUserCommand({
    userId: newUserWithDefaultParams.userId,
    user: {
      firstName: newFirstName,
      lastName: "Doe",
      age: 32,
      weight: 185.3,
      smoker: false
    }
  });

  const response = await userServiceClient.send(request);

  expect(response.$metadata.httpStatusCode).toEqual(200);

  expect(response.user?.userId).toBe(request.input.userId);
  expect(response.user?.firstName).toBe(request.input.user?.firstName);
  expect(response.user?.lastName).toBe(request.input.user?.lastName);
  expect(response.user?.age).toBe(request.input.user?.age);
  expect(response.user?.weight).toBe(request.input.user?.weight);
  expect(response.user?.smoker).toBe(request.input.user?.smoker);
});

test("destroy user", async ({ userServiceClient, newUserWithDefaultParams }) => {
  const response = await userServiceClient.send(
    new DestroyUserCommand({ userId: newUserWithDefaultParams.userId })
  );

  expect(response.$metadata.httpStatusCode).toEqual(200);

  expect(response.success).toBe(true);
});
