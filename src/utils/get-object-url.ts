export const getObjectUrl = (bucket: string, region: string, key: string) =>
  `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
