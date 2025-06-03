/* eslint-disable functional/type-declaration-immutability */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

/*
  Rationale for disabling these ESLint rules:
  This file extends Playwright, so it made sense to keep things consistent
  with how they do things
*/

import { test as base } from '@playwright/test';
import { CreateUserCommand, UserDto, UserServiceClient } from '@cgtfarmer/user-service-client';
import { EnvironmentConfigAccessor } from './environment-config-accessor';
import { EnvironmentAccessor } from '../lib/environment-accessor';

export type TestOptionExtensions = {
};

export type TestFixtureExtensions = {
  userServiceClient: UserServiceClient;

  newUserWithDefaultParams: UserDto
};

const config = new EnvironmentConfigAccessor(
  new EnvironmentAccessor()
).getConfig();

export const test = base.extend<TestOptionExtensions & TestFixtureExtensions>({
  // PlaywrightTestOptions
  baseURL: config.baseUrl,

  // TestOptionExtensions
  // corsOrigins: [EnvironmentConfigAccessor.getAsArray('PW_CORS_ORIGINS'), { option: true }],

  // TestFixtureExtensions
  userServiceClient: async ({ baseURL }, use) => {
    if (!baseURL) throw Error("baseURL is undefined");

    const client = new UserServiceClient({
      endpoint: baseURL
    });

    await use(client);
  },

  newUserWithDefaultParams: async ({ userServiceClient }, use) => {
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

    if (!response.user) throw new Error("Default user failed to create");

    await use(response.user);
  }
});

export { defineConfig, expect, request } from '@playwright/test';

export type { FullConfig, TestType } from '@playwright/test';
