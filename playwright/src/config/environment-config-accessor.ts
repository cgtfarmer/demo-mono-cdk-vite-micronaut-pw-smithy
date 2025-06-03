import { EnvironmentAccessor } from '../lib/environment-accessor';
import { ConfigAccessor } from './config-accessor';
import { TestConfig } from './test-config';

export class EnvironmentConfigAccessor implements ConfigAccessor {

  constructor(private readonly environmentAccessor: EnvironmentAccessor) {
  }

  public getConfig(): TestConfig {
    return {
      baseUrl: this.environmentAccessor.get("BASE_URL")
    };
  }
}
