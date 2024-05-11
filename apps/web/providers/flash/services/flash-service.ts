export class Flash {
  readonly #messages: Record<string, string> = {};

  set(key: string, value: string): void {
    this.#messages[key] = value;
  }

  get(key: string): string | undefined {
    return this.#messages[key];
  }

  has(key: string): boolean {
    return Boolean(this.#messages[key]);
  }
}

export const flash = new Flash();
