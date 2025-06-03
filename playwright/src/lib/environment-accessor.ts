export class EnvironmentAccessor {

  public get(key: string): string {
    const value = process.env[key];

    if (!value) throw Error(`${key} is undefined`);

    return value;
  };

  public getOptional(key: string): string | undefined {
    const value = process.env[key];

    return value;
  };

  public getAsArray(key: string): string[] {
    const value = this.get(key);

    return value.split(',');
  };
}
