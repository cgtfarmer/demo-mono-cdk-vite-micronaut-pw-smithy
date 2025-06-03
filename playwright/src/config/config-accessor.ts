import { TestConfig } from './test-config';

export interface ConfigAccessor {
  getConfig(): TestConfig;
}
