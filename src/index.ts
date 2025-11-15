// https://chat.qwen.ai/c/0867dd83-9812-4915-b1d7-a4c9b14de208

// Get inspect.custom for Node.js console.log support (browser-safe)
let inspectCustom: symbol | undefined;
try {
  // Try to get inspect.custom from Node.js util module (only available in Node.js)
  if (typeof require !== 'undefined') {
    const util = require('util');
    inspectCustom = util.inspect?.custom;
  }
} catch {
  // Browser environment, inspect.custom not available
  inspectCustom = undefined;
}

export interface UrlLiteralResult {
  /**
   * Replace path parameters (e.g., :id) with actual values
   * @param params - An object containing path parameters to replace
   * @returns A new UrlLiteralResult instance with replaced path parameters
   */
  params(params?: Record<string, any> | null): UrlLiteralResult;
  /**
   * Add query parameters to the URL path
   * @param params - An object containing query parameters. Null/undefined values will be ignored.
   * @returns A new UrlLiteralResult instance with query parameters
   */
  query(params?: Record<string, any> | null): UrlLiteralResult;
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
 * Creates a new UrlLiteralResult instance with the given path and optional query parameters
 */
function createUrlLiteralResult(path: string, queryParams?: URLSearchParams): UrlLiteralResult {
  const result: UrlLiteralResult = {
    params: function(params?: Record<string, any> | null): UrlLiteralResult {
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
    query: function(params?: Record<string, any> | null): UrlLiteralResult {
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
    toString: function(): string {
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

  // Add inspect.custom for Node.js console.log support (only in Node.js environment)
  if (inspectCustom) {
    result[inspectCustom] = function(): string {
      // Customize console.log output to show the URL string
      return this.toString();
    };
  }

  return result;
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
