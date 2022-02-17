export class LruCache<T> {
  private values: Map<string, T> = new Map<string, T>();
  private maxEntries: number = 20;

  public get(key: string): T | undefined {
    const hasKey = this.values.has(key);
    let entry: T | undefined = undefined;
    if (hasKey) {
      entry = this.values.get(key)!;
      this.values.delete(key);
      this.values.set(key, entry);
    }

    return entry;
  }

  public put(key: string, value: T) {
    if (this.values.size >= this.maxEntries) {
      const keyToDelete = this.values.keys().next().value;
      this.values.delete(keyToDelete);
    }

    this.values.set(key, value);
  }
}
