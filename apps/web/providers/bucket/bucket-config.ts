export const bucketConfig = {
  path: '/bucket/:key',
  rewrite: (key: string) => `/bucket/${key}`,
};
