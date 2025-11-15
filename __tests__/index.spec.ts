import urlLiteral from '../src';

describe('urlLiteral', () => {
  describe('Basic path building', () => {
    test('should build a simple path', () => {
      const url = urlLiteral`/api/users`;
      expect(url.toString()).toBe('/api/users');
    });

    test('should handle path with variables', () => {
      const userId = 123;
      const url = urlLiteral`/api/users/${userId}`;
      expect(url.toString()).toBe('/api/users/123');
    });

    test('should handle multiple variables', () => {
      const userId = 123;
      const postId = 456;
      const url = urlLiteral`/api/users/${userId}/posts/${postId}`;
      expect(url.toString()).toBe('/api/users/123/posts/456');
    });

    test('should handle string variables', () => {
      const category = 'tech';
      const url = urlLiteral`/api/posts/${category}`;
      expect(url.toString()).toBe('/api/posts/tech');
    });
  });

  describe('withQuery method', () => {
    test('should add a single query parameter', () => {
      const url = urlLiteral`/api/users`.withQuery({ page: 1 });
      expect(url.toString()).toBe('/api/users?page=1');
    });

    test('should add multiple query parameters', () => {
      const url = urlLiteral`/api/users`.withQuery({ page: 1, limit: 10 });
      expect(url.toString()).toBe('/api/users?page=1&limit=10');
    });

    test('should handle empty object and return original path', () => {
      const url = urlLiteral`/api/users`.withQuery({});
      expect(url.toString()).toBe('/api/users');
    });

    test('should handle null parameter and return original path', () => {
      const url = urlLiteral`/api/users`.withQuery(null);
      expect(url.toString()).toBe('/api/users');
    });

    test('should handle undefined parameter and return original path', () => {
      const url = urlLiteral`/api/users`.withQuery(undefined);
      expect(url.toString()).toBe('/api/users');
    });

    test('should ignore query parameters with null values', () => {
      const url = urlLiteral`/api/users`.withQuery({ page: 1, search: null });
      expect(url.toString()).toBe('/api/users?page=1');
    });

    test('should ignore query parameters with undefined values', () => {
      const url = urlLiteral`/api/users`.withQuery({ page: 1, search: undefined });
      expect(url.toString()).toBe('/api/users?page=1');
    });

    test('should handle numeric query parameters', () => {
      const url = urlLiteral`/api/users`.withQuery({ page: 1, limit: 10 });
      expect(url.toString()).toBe('/api/users?page=1&limit=10');
    });

    test('should handle string query parameters', () => {
      const url = urlLiteral`/api/users`.withQuery({ name: 'john', role: 'admin' });
      expect(url.toString()).toBe('/api/users?name=john&role=admin');
    });

    test('should handle boolean query parameters', () => {
      const url = urlLiteral`/api/users`.withQuery({ active: true, verified: false });
      expect(url.toString()).toBe('/api/users?active=true&verified=false');
    });

    test('should use & separator when path already contains ?', () => {
      const url = urlLiteral`/api/users?sort=name`.withQuery({ page: 1 });
      expect(url.toString()).toBe('/api/users?sort=name&page=1');
    });

    test('should combine variables and query parameters', () => {
      const userId = 123;
      const url = urlLiteral`/api/users/${userId}/posts`.withQuery({ page: 1, limit: 10 });
      expect(url.toString()).toBe('/api/users/123/posts?page=1&limit=10');
    });

    test('should handle query parameter values with special characters', () => {
      const url = urlLiteral`/api/search`.withQuery({ q: 'hello world', filter: 'a=b' });
      expect(url.toString()).toContain('q=hello+world');
      expect(url.toString()).toContain('filter=a%3Db');
    });

    test('should handle query parameter with value 0', () => {
      const url = urlLiteral`/api/users`.withQuery({ page: 0 });
      expect(url.toString()).toBe('/api/users?page=0');
    });

    test('should handle query parameter with empty string value', () => {
      const url = urlLiteral`/api/users`.withQuery({ search: '' });
      expect(url.toString()).toBe('/api/users?search=');
    });

    test('should support chaining with withParam', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 }).withQuery({ page: 1, limit: 10 });
      expect(url.toString()).toBe('/api/users/123?page=1&limit=10');
    });

    test('should support chaining withQuery then withParam', () => {
      const url = urlLiteral`/api/users/:id`.withQuery({ page: 1 }).withParam({ id: 123 });
      expect(url.toString()).toBe('/api/users/123?page=1');
    });
  });

  describe('withParam method', () => {
    test('should replace single path parameter', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 });
      expect(url.toString()).toBe('/api/users/123');
    });

    test('should replace multiple path parameters', () => {
      const url = urlLiteral`/api/users/:userId/posts/:postId`.withParam({ userId: 123, postId: 456 });
      expect(url.toString()).toBe('/api/users/123/posts/456');
    });

    test('should handle empty object and return original path', () => {
      const url = urlLiteral`/api/users/:id`.withParam({});
      expect(url.toString()).toBe('/api/users/:id');
    });

    test('should handle null parameter and return original path', () => {
      const url = urlLiteral`/api/users/:id`.withParam(null);
      expect(url.toString()).toBe('/api/users/:id');
    });

    test('should handle undefined parameter and return original path', () => {
      const url = urlLiteral`/api/users/:id`.withParam(undefined);
      expect(url.toString()).toBe('/api/users/:id');
    });

    test('should ignore null/undefined values in params', () => {
      const url = urlLiteral`/api/users/:id/posts/:postId`.withParam({ id: 123, postId: null });
      expect(url.toString()).toBe('/api/users/123/posts/:postId');
    });

    test('should replace path parameters with string values', () => {
      const url = urlLiteral`/api/categories/:category`.withParam({ category: 'tech' });
      expect(url.toString()).toBe('/api/categories/tech');
    });

    test('should replace path parameters with numeric values', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 0 });
      expect(url.toString()).toBe('/api/users/0');
    });

    test('should handle path parameters at the end of path', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 });
      expect(url.toString()).toBe('/api/users/123');
    });

    test('should handle path parameters in the middle of path', () => {
      const url = urlLiteral`/api/users/:id/posts`.withParam({ id: 123 });
      expect(url.toString()).toBe('/api/users/123/posts');
    });

    test('should support chaining with withQuery', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 }).withQuery({ page: 1, limit: 10 });
      expect(url.toString()).toBe('/api/users/123?page=1&limit=10');
    });
  });

  describe('toString method', () => {
    test('should return basic path string', () => {
      const url = urlLiteral`/api/users/123`;
      expect(url.toString()).toBe('/api/users/123');
    });

    test('toString should include query parameters after calling withQuery method', () => {
      const urlObj = urlLiteral`/api/users`.withQuery({ page: 1 });
      expect(urlObj.toString()).toBe('/api/users?page=1');
      // original object's toString still returns basic path
      const originalObj = urlLiteral`/api/users`;
      expect(originalObj.toString()).toBe('/api/users');
    });

    test('toString should reflect params after calling withParam method', () => {
      const urlObj = urlLiteral`/api/users/:id`.withParam({ id: 123 });
      expect(urlObj.toString()).toBe('/api/users/123');
      // original object's toString still returns original path
      const originalObj = urlLiteral`/api/users/:id`;
      expect(originalObj.toString()).toBe('/api/users/:id');
    });

    test('toString should include both params and query when chained', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 }).withQuery({ page: 1 });
      expect(url.toString()).toBe('/api/users/123?page=1');
    });
  });

  describe('Symbol.toPrimitive - automatic string conversion', () => {
    test('should automatically convert to string in template literals', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 }).withQuery({ page: 1 });
      const result = `${url}`;
      expect(result).toBe('/api/users/123?page=1');
    });

    test('should automatically convert to string when concatenated', () => {
      const url = urlLiteral`/api/users`.withQuery({ page: 1 });
      const result = 'GET ' + url;
      expect(result).toBe('GET /api/users?page=1');
    });

    test('should automatically convert to string with String()', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 });
      const result = String(url);
      expect(result).toBe('/api/users/123');
    });

    test('should automatically convert when used in string interpolation', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 }).withQuery({ page: 1 });
      const message = `Fetching ${url}`;
      expect(message).toBe('Fetching /api/users/123?page=1');
    });

    test('should automatically convert in string concatenation with empty string', () => {
      const url = urlLiteral`/api/users`.withQuery({ page: 1 });
      const result = url + '';
      expect(result).toBe('/api/users?page=1');
    });

    test('should work with params and query in automatic conversion', () => {
      const url = urlLiteral`/api/users/:id/posts/:postId`
        .withParam({ id: 123, postId: 456 })
        .withQuery({ page: 1, limit: 10 });
      const result = `${url}`;
      expect(result).toBe('/api/users/123/posts/456?page=1&limit=10');
    });

    test('toString() still works explicitly', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 }).withQuery({ page: 1 });
      expect(url.toString()).toBe('/api/users/123?page=1');
      // Both should work the same
      expect(`${url}`).toBe(url.toString());
    });
  });

  describe('value property', () => {
    test('should return URL string via value property', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 }).withQuery({ page: 1 });
      expect(url.value).toBe('/api/users/123?page=1');
    });

    test('should work with basic path', () => {
      const url = urlLiteral`/api/users`;
      expect(url.value).toBe('/api/users');
    });

    test('should work with query parameters only', () => {
      const url = urlLiteral`/api/users`.withQuery({ page: 1, limit: 10 });
      expect(url.value).toBe('/api/users?page=1&limit=10');
    });

    test('should work with params only', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 });
      expect(url.value).toBe('/api/users/123');
    });

    test('should work with chained params and query', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 }).withQuery({ page: 1, limit: 10 });
      expect(url.value).toBe('/api/users/123?page=1&limit=10');
    });

    test('value should be readonly and match toString()', () => {
      const url = urlLiteral`/api/users/:id`.withParam({ id: 123 }).withQuery({ page: 1 });
      expect(url.value).toBe(url.toString());
      expect(url.value).toBe('/api/users/123?page=1');
    });
  });

  describe('param method (legacy)', () => {
    test('should replace single path parameter and return string directly', () => {
      const result = urlLiteral`/api/users/:id`.param({ id: 123 });
      expect(result).toBe('/api/users/123');
    });

    test('should replace multiple path parameters and return string directly', () => {
      const result = urlLiteral`/api/users/:userId/posts/:postId`.param({ userId: 123, postId: 456 });
      expect(result).toBe('/api/users/123/posts/456');
    });

    test('should handle empty object and return original path', () => {
      const result = urlLiteral`/api/users/:id`.param({});
      expect(result).toBe('/api/users/:id');
    });

    test('should handle null parameter and return original path', () => {
      const result = urlLiteral`/api/users/:id`.param(null);
      expect(result).toBe('/api/users/:id');
    });

    test('should handle undefined parameter and return original path', () => {
      const result = urlLiteral`/api/users/:id`.param(undefined);
      expect(result).toBe('/api/users/:id');
    });

    test('should ignore null/undefined values in params', () => {
      const result = urlLiteral`/api/users/:id/posts/:postId`.param({ id: 123, postId: null });
      expect(result).toBe('/api/users/123/posts/:postId');
    });

    test('should replace path parameters with string values', () => {
      const result = urlLiteral`/api/categories/:category`.param({ category: 'tech' });
      expect(result).toBe('/api/categories/tech');
    });

    test('should replace path parameters with numeric values', () => {
      const result = urlLiteral`/api/users/:id`.param({ id: 0 });
      expect(result).toBe('/api/users/0');
    });

    test('should handle path parameters at the end of path', () => {
      const result = urlLiteral`/api/users/:id`.param({ id: 123 });
      expect(result).toBe('/api/users/123');
    });

    test('should handle path parameters in the middle of path', () => {
      const result = urlLiteral`/api/users/:id/posts`.param({ id: 123 });
      expect(result).toBe('/api/users/123/posts');
    });

    test('should return a plain string, not an UrlLiteralResult object', () => {
      const result = urlLiteral`/api/users/:id`.param({ id: 123 });
      expect(typeof result).toBe('string');
      expect(result).toBe('/api/users/123');
    });

    test('should work with combined path variables and params', () => {
      const userId = 456;
      const result = urlLiteral`/api/users/${userId}/posts/:postId`.param({ postId: 789 });
      expect(result).toBe('/api/users/456/posts/789');
    });
  });

  describe('query method (legacy)', () => {
    test('should add a single query parameter and return string directly', () => {
      const result = urlLiteral`/api/users`.query({ page: 1 });
      expect(result).toBe('/api/users?page=1');
    });

    test('should add multiple query parameters and return string directly', () => {
      const result = urlLiteral`/api/users`.query({ page: 1, limit: 10 });
      expect(result).toBe('/api/users?page=1&limit=10');
    });

    test('should handle empty object and return original path', () => {
      const result = urlLiteral`/api/users`.query({});
      expect(result).toBe('/api/users');
    });

    test('should handle null parameter and return original path', () => {
      const result = urlLiteral`/api/users`.query(null);
      expect(result).toBe('/api/users');
    });

    test('should handle undefined parameter and return original path', () => {
      const result = urlLiteral`/api/users`.query(undefined);
      expect(result).toBe('/api/users');
    });

    test('should ignore query parameters with null values', () => {
      const result = urlLiteral`/api/users`.query({ page: 1, search: null });
      expect(result).toBe('/api/users?page=1');
    });

    test('should ignore query parameters with undefined values', () => {
      const result = urlLiteral`/api/users`.query({ page: 1, search: undefined });
      expect(result).toBe('/api/users?page=1');
    });

    test('should handle numeric query parameters', () => {
      const result = urlLiteral`/api/users`.query({ page: 1, limit: 10 });
      expect(result).toBe('/api/users?page=1&limit=10');
    });

    test('should handle string query parameters', () => {
      const result = urlLiteral`/api/users`.query({ name: 'john', role: 'admin' });
      expect(result).toBe('/api/users?name=john&role=admin');
    });

    test('should handle boolean query parameters', () => {
      const result = urlLiteral`/api/users`.query({ active: true, verified: false });
      expect(result).toBe('/api/users?active=true&verified=false');
    });

    test('should use & separator when path already contains ?', () => {
      const result = urlLiteral`/api/users?sort=name`.query({ page: 1 });
      expect(result).toBe('/api/users?sort=name&page=1');
    });

    test('should combine variables and query parameters', () => {
      const userId = 123;
      const result = urlLiteral`/api/users/${userId}/posts`.query({ page: 1, limit: 10 });
      expect(result).toBe('/api/users/123/posts?page=1&limit=10');
    });

    test('should handle query parameter values with special characters', () => {
      const result = urlLiteral`/api/search`.query({ q: 'hello world', filter: 'a=b' });
      expect(result).toContain('q=hello+world');
      expect(result).toContain('filter=a%3Db');
    });

    test('should handle query parameter with value 0', () => {
      const result = urlLiteral`/api/users`.query({ page: 0 });
      expect(result).toBe('/api/users?page=0');
    });

    test('should handle query parameter with empty string value', () => {
      const result = urlLiteral`/api/users`.query({ search: '' });
      expect(result).toBe('/api/users?search=');
    });

    test('should return a plain string, not an UrlLiteralResult object', () => {
      const result = urlLiteral`/api/users`.query({ page: 1 });
      expect(typeof result).toBe('string');
      expect(result).toBe('/api/users?page=1');
    });

    test('should work with path that has params', () => {
      const result = urlLiteral`/api/users/:id`.withParam({ id: 123 }).query({ page: 1 });
      expect(result).toBe('/api/users/123?page=1');
    });
  });
});
