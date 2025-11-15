// https://chat.qwen.ai/c/0867dd83-9812-4915-b1d7-a4c9b14de208

export interface UrlLiteralResult {
  /**
   * Replace path parameters (e.g., :id) with actual values
   * @param params - An object containing path parameters to replace
   * @returns The URL string with replaced path parameters
   */
  params(params?: Record<string, any> | null): string;
  /**
   * Add query parameters to the URL path
   * @param params - An object containing query parameters. Null/undefined values will be ignored.
   * @returns The complete URL string with query parameters
   */
  query(params?: Record<string, any> | null): string;
  /**
   * Get the base path string without query parameters
   * @returns The base path string
   */
  toString(): string;
}

/**
 * Creates a new UrlLiteralResult instance with the given path
 */
function createUrlLiteralResult(path: string): UrlLiteralResult {
  return {
    params: function(params?: Record<string, any> | null): string {
      if (!params || Object.keys(params).length === 0) {
        return path;
      }

      let replacedPath = path;
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
          // Replace :paramName with the actual value
          const pattern = new RegExp(`:${key}(?=/|$|\\?)`, 'g');
          replacedPath = replacedPath.replace(pattern, String(value));
        }
      });

      return replacedPath;
    },
    query: function(params?: Record<string, any> | null): string {
      if (!params || Object.keys(params).length === 0) {
        return path;
      }

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
          searchParams.append(key, String(value));
        }
      });

      const separator = path.includes('?') ? '&' : '?';
      return `${path}${separator}${searchParams.toString()}`;
    },
    toString: (): string => path
  };
}

/**
 * Template literal tag function for building safe, readable URLs
 * @param strings - Template string parts
 * @param values - Interpolated values
 * @returns An object with params(), query() and toString() methods
 */
const urlLiteral = (strings: TemplateStringsArray, ...values: any[]): UrlLiteralResult => {
  let path = '';
  strings.forEach((str, i) => {
    path += str;
    if (values[i] !== undefined) {
      path += values[i];
    }
  });

  return createUrlLiteralResult(path);
};

export default urlLiteral;
