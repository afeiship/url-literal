// https://chat.qwen.ai/c/0867dd83-9812-4915-b1d7-a4c9b14de208

export interface UrlLiteralResult {
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
 * Template literal tag function for building safe, readable URLs
 * @param strings - Template string parts
 * @param values - Interpolated values
 * @returns An object with query() and toString() methods
 */
const urlLiteral = (strings: TemplateStringsArray, ...values: any[]): UrlLiteralResult => {
  let path = '';
  strings.forEach((str, i) => {
    path += str;
    if (values[i] !== undefined) {
      path += values[i];
    }
  });

  return {
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
};

export default urlLiteral;
