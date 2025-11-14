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
      expect(url).toBe('/api/users?page=1');
    });

    test('should add multiple query parameters', () => {
      const url = urlLiteral`/api/users`.query({ page: 1, limit: 10 });
      expect(url).toBe('/api/users?page=1&limit=10');
    });

    test('should handle empty object and return original path', () => {
      const url = urlLiteral`/api/users`.query({});
      expect(url).toBe('/api/users');
    });

    test('should handle null parameter and return original path', () => {
      const url = urlLiteral`/api/users`.query(null);
      expect(url).toBe('/api/users');
    });

    test('should handle undefined parameter and return original path', () => {
      const url = urlLiteral`/api/users`.query(undefined);
      expect(url).toBe('/api/users');
    });

    test('should ignore query parameters with null values', () => {
      const url = urlLiteral`/api/users`.query({ page: 1, search: null });
      expect(url).toBe('/api/users?page=1');
    });

    test('should ignore query parameters with undefined values', () => {
      const url = urlLiteral`/api/users`.query({ page: 1, search: undefined });
      expect(url).toBe('/api/users?page=1');
    });

    test('should handle numeric query parameters', () => {
      const url = urlLiteral`/api/users`.query({ page: 1, limit: 10 });
      expect(url).toBe('/api/users?page=1&limit=10');
    });

    test('should handle string query parameters', () => {
      const url = urlLiteral`/api/users`.query({ name: 'john', role: 'admin' });
      expect(url).toBe('/api/users?name=john&role=admin');
    });

    test('should handle boolean query parameters', () => {
      const url = urlLiteral`/api/users`.query({ active: true, verified: false });
      expect(url).toBe('/api/users?active=true&verified=false');
    });

    test('should use & separator when path already contains ?', () => {
      const url = urlLiteral`/api/users?sort=name`.query({ page: 1 });
      expect(url).toBe('/api/users?sort=name&page=1');
    });

    test('should combine variables and query parameters', () => {
      const userId = 123;
      const url = urlLiteral`/api/users/${userId}/posts`.query({ page: 1, limit: 10 });
      expect(url).toBe('/api/users/123/posts?page=1&limit=10');
    });

    test('should handle query parameter values with special characters', () => {
      const url = urlLiteral`/api/search`.query({ q: 'hello world', filter: 'a=b' });
      expect(url).toContain('q=hello+world');
      expect(url).toContain('filter=a%3Db');
    });

    test('should handle query parameter with value 0', () => {
      const url = urlLiteral`/api/users`.query({ page: 0 });
      expect(url).toBe('/api/users?page=0');
    });

    test('should handle query parameter with empty string value', () => {
      const url = urlLiteral`/api/users`.query({ search: '' });
      expect(url).toBe('/api/users?search=');
    });
  });

  describe('toString method', () => {
    test('should return basic path string', () => {
      const url = urlLiteral`/api/users/123`;
      expect(url.toString()).toBe('/api/users/123');
    });

    test('toString should not include query parameters even after calling query method', () => {
      const urlObj = urlLiteral`/api/users`;
      expect(urlObj.toString()).toBe('/api/users');
      // query method returns string, doesn't affect original object's toString
      const queryUrl = urlObj.query({ page: 1 });
      expect(queryUrl).toBe('/api/users?page=1');
      // original object's toString still returns basic path
      expect(urlObj.toString()).toBe('/api/users');
    });
  });
});
