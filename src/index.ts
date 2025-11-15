// https://chat.qwen.ai/c/0867dd83-9812-4915-b1d7-a4c9b14de208
// https://chat.qwen.ai/c/d5455274-d538-41b2-94da-2f18de129c74

export interface UrlLiteralResult {
  /**
   * Replace path parameters (e.g., :id) with actual values
   * @param params - An object containing path parameters to replace
   * @returns A new UrlLiteralResult instance with replaced path parameters
   */
  withParam(params?: Record<string, any> | null): UrlLiteralResult;
  /**
   * Add query parameters to the URL path
   * @param params - An object containing query parameters. Null/undefined values will be ignored.
   * @returns A new UrlLiteralResult instance with query parameters
   */
  withQuery(params?: Record<string, any> | null): UrlLiteralResult;
  /**
   * Add path parameters and return the final string directly
   * @param params - An object containing path parameters to replace
   * @returns The final URL string with path parameters replaced
   */
  param(params?: Record<string, any> | null): string;
  /**
   * Add query parameters and return the final string directly
   * @param params - An object containing query parameters. Null/undefined values will be ignored.
   * @returns The final URL string with query parameters added
   */
  query(params?: Record<string, any> | null): string;
  /**
   * Get the base path string without query parameters
   * @returns The base path string
   */
  toString(): string;
  /**
   * Converts the object to a primitive value when used in string/number contexts
   * @param hint - The preferred type of the result ('string', 'number', or 'default')
   * @returns The complete URL string
   */
  [Symbol.toPrimitive](hint: 'string' | 'number' | 'default'): string;
}

/**
 * Type definition for the urlLiteral template literal tag function
 */
export type UrlLiteralFunction = (strings: TemplateStringsArray, ...values: any[]) => UrlLiteralResult;

/**
 * Alias for UrlLiteralFunction for easier import and usage
 */
export type UrlLiteral = UrlLiteralFunction;

/**
 * Creates a new UrlLiteralResult instance with the given path and optional query parameters
 */
function createUrlLiteralResult(path: string, queryParams?: URLSearchParams): UrlLiteralResult {
  const result: UrlLiteralResult = {
    withParam: function (params?: Record<string, any> | null): UrlLiteralResult {
      if (!params || Object.keys(params).length === 0) {
        return createUrlLiteralResult(path, queryParams);
      }

      let replacedPath = path;
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
          // Replace :paramName with the actual value
          const pattern = new RegExp(`:${key}(?=/|$|\\?)`, 'g');
          replacedPath = replacedPath.replace(pattern, String(value));
        }
      });

      return createUrlLiteralResult(replacedPath, queryParams);
    },
    withQuery: function (params?: Record<string, any> | null): UrlLiteralResult {
      if (!params || Object.keys(params).length === 0) {
        return createUrlLiteralResult(path, queryParams);
      }

      const searchParams = queryParams ? new URLSearchParams(queryParams) : new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
          searchParams.append(key, String(value));
        }
      });

      return createUrlLiteralResult(path, searchParams);
    },
    param: function (params?: Record<string, any> | null): string {
      return this.withParam(params).toString();
    },
    query: function (params?: Record<string, any> | null): string {
      return this.withQuery(params).toString();
    },
    toString: function (): string {
      if (!queryParams || queryParams.toString().length === 0) {
        return path;
      }
      const separator = path.includes('?') ? '&' : '?';
      return `${path}${separator}${queryParams.toString()}`;
    },
    [Symbol.toPrimitive](hint: 'string' | 'number' | 'default'): string {
      // Automatically convert to string by calling toString()
      return this.toString();
    }
  };

  return result;
}

/**
 * Template literal tag function for building safe, readable URLs
 * @param strings - Template string parts
 * @param values - Interpolated values
 * @returns An object with params(), query() and toString() methods
 */
const urlLiteral: UrlLiteralFunction = (strings: TemplateStringsArray, ...values: any[]): UrlLiteralResult => {
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
