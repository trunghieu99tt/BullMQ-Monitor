export class ObjectTool {
  static omit(obj: any, keys: string[]): any {
    return Object.keys(obj)
      .filter((key) => !keys.includes(key))
      .reduce((result, key) => ({ ...result, [key]: obj[key] }), {});
  }
}
