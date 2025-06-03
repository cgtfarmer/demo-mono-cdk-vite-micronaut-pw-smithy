import { test, expect } from '../config/playwright-extensions';
import { GetHealthCommand } from '@cgtfarmer/user-service-client';

test("healthcheck", async ({ userServiceClient }) => {
  const response = await userServiceClient.send(new GetHealthCommand());

  expect(response.$metadata.httpStatusCode).toEqual(200);

  expect(response.message).toBe("Healthy");
});
