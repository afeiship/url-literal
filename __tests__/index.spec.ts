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

  describe('query method', () => {
    test('should add a single query parameter', () => {
      const url = urlLiteral`/api/users`.query({ page: 1 });
      expect(url.toString()).toBe('/api/users?page=1');
    });

    test('should add multiple query parameters', () => {
      const url = urlLiteral`/api/users`.query({ page: 1, limit: 10 });
      expect(url.toString()).toBe('/api/users?page=1&limit=10');
    });

    test('should handle empty object and return original path', () => {
      const url = urlLiteral`/api/users`.query({});
      expect(url.toString()).toBe('/api/users');
    });

    test('should handle null parameter and return original path', () => {
      const url = urlLiteral`/api/users`.query(null);
      expect(url.toString()).toBe('/api/users');
    });

    test('should handle undefined parameter and return original path', () => {
      const url = urlLiteral`/api/users`.query(undefined);
      expect(url.toString()).toBe('/api/users');
    });

    test('should ignore query parameters with null values', () => {
      const url = urlLiteral`/api/users`.query({ page: 1, search: null });
      expect(url.toString()).toBe('/api/users?page=1');
    });

    test('should ignore query parameters with undefined values', () => {
      const url = urlLiteral`/api/users`.query({ page: 1, search: undefined });
      expect(url.toString()).toBe('/api/users?page=1');
    });

    test('should handle numeric query parameters', () => {
      const url = urlLiteral`/api/users`.query({ page: 1, limit: 10 });
      expect(url.toString()).toBe('/api/users?page=1&limit=10');
    });

    test('should handle string query parameters', () => {
      const url = urlLiteral`/api/users`.query({ name: 'john', role: 'admin' });
      expect(url.toString()).toBe('/api/users?name=john&role=admin');
    });

    test('should handle boolean query parameters', () => {
      const url = urlLiteral`/api/users`.query({ active: true, verified: false });
      expect(url.toString()).toBe('/api/users?active=true&verified=false');
    });

    test('should use & separator when path already contains ?', () => {
      const url = urlLiteral`/api/users?sort=name`.query({ page: 1 });
      expect(url.toString()).toBe('/api/users?sort=name&page=1');
    });

    test('should combine variables and query parameters', () => {
      const userId = 123;
      const url = urlLiteral`/api/users/${userId}/posts`.query({ page: 1, limit: 10 });
      expect(url.toString()).toBe('/api/users/123/posts?page=1&limit=10');
    });

    test('should handle query parameter values with special characters', () => {
      const url = urlLiteral`/api/search`.query({ q: 'hello world', filter: 'a=b' });
      expect(url.toString()).toContain('q=hello+world');
      expect(url.toString()).toContain('filter=a%3Db');
    });

    test('should handle query parameter with value 0', () => {
      const url = urlLiteral`/api/users`.query({ page: 0 });
      expect(url.toString()).toBe('/api/users?page=0');
    });

    test('should handle query parameter with empty string value', () => {
      const url = urlLiteral`/api/users`.query({ search: '' });
      expect(url.toString()).toBe('/api/users?search=');
    });

    test('should support chaining with params', () => {
      const url = urlLiteral`/api/users/:id`.params({ id: 123 }).query({ page: 1, limit: 10 });
      expect(url.toString()).toBe('/api/users/123?page=1&limit=10');
    });

    test('should support chaining query then params', () => {
      const url = urlLiteral`/api/users/:id`.query({ page: 1 }).params({ id: 123 });
      expect(url.toString()).toBe('/api/users/123?page=1');
    });
  });

  describe('params method', () => {
    test('should replace single path parameter', () => {
      const url = urlLiteral`/api/users/:id`.params({ id: 123 });
      expect(url.toString()).toBe('/api/users/123');
    });

    test('should replace multiple path parameters', () => {
      const url = urlLiteral`/api/users/:userId/posts/:postId`.params({ userId: 123, postId: 456 });
      expect(url.toString()).toBe('/api/users/123/posts/456');
    });

    test('should handle empty object and return original path', () => {
      const url = urlLiteral`/api/users/:id`.params({});
      expect(url.toString()).toBe('/api/users/:id');
    });

    test('should handle null parameter and return original path', () => {
      const url = urlLiteral`/api/users/:id`.params(null);
      expect(url.toString()).toBe('/api/users/:id');
    });

    test('should handle undefined parameter and return original path', () => {
      const url = urlLiteral`/api/users/:id`.params(undefined);
      expect(url.toString()).toBe('/api/users/:id');
    });

    test('should ignore null/undefined values in params', () => {
      const url = urlLiteral`/api/users/:id/posts/:postId`.params({ id: 123, postId: null });
      expect(url.toString()).toBe('/api/users/123/posts/:postId');
    });

    test('should replace path parameters with string values', () => {
      const url = urlLiteral`/api/categories/:category`.params({ category: 'tech' });
      expect(url.toString()).toBe('/api/categories/tech');
    });

    test('should replace path parameters with numeric values', () => {
      const url = urlLiteral`/api/users/:id`.params({ id: 0 });
      expect(url.toString()).toBe('/api/users/0');
    });

    test('should handle path parameters at the end of path', () => {
      const url = urlLiteral`/api/users/:id`.params({ id: 123 });
      expect(url.toString()).toBe('/api/users/123');
    });

    test('should handle path parameters in the middle of path', () => {
      const url = urlLiteral`/api/users/:id/posts`.params({ id: 123 });
      expect(url.toString()).toBe('/api/users/123/posts');
    });

    test('should support chaining with query', () => {
      const url = urlLiteral`/api/users/:id`.params({ id: 123 }).query({ page: 1, limit: 10 });
      expect(url.toString()).toBe('/api/users/123?page=1&limit=10');
    });
  });

  describe('toString method', () => {
    test('should return basic path string', () => {
      const url = urlLiteral`/api/users/123`;
      expect(url.toString()).toBe('/api/users/123');
    });

    test('toString should include query parameters after calling query method', () => {
      const urlObj = urlLiteral`/api/users`.query({ page: 1 });
      expect(urlObj.toString()).toBe('/api/users?page=1');
      // original object's toString still returns basic path
      const originalObj = urlLiteral`/api/users`;
      expect(originalObj.toString()).toBe('/api/users');
    });

    test('toString should reflect params after calling params method', () => {
      const urlObj = urlLiteral`/api/users/:id`.params({ id: 123 });
      expect(urlObj.toString()).toBe('/api/users/123');
      // original object's toString still returns original path
      const originalObj = urlLiteral`/api/users/:id`;
      expect(originalObj.toString()).toBe('/api/users/:id');
    });

    test('toString should include both params and query when chained', () => {
      const url = urlLiteral`/api/users/:id`.params({ id: 123 }).query({ page: 1 });
      expect(url.toString()).toBe('/api/users/123?page=1');
    });
  });
});
