// https://chat.qwen.ai/c/0867dd83-9812-4915-b1d7-a4c9b14de208

const urlLiteral = (strings, ...values) => {
   let path = '';
  strings.forEach((str, i) => {
    path += str;
    if (values[i] !== undefined) {
      path += values[i];
    }
  });

  return {
    query: function(params) {
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
    toString: () => path
  };
};

export default urlLiteral;
