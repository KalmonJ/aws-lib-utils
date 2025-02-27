import {
  presignedUrlUpload as presignedUpload,
  S3Config,
  RequestPresigningArguments,
} from "./url-presigned-upload";

import { chunkUpload as awsChunkUpload } from "./chunk-upload";
import { getValidMimeType } from "../../utils/mime-type";

export type AWSProviderProps = {
  SECRET_KEY: string;
  REGION: string;
  ACCESS_KEY_ID: string;
};

export type UploadBaseProps = {
  file: File | null;
  bucket: string;
  accept?: string[];
  key: string;
};

export interface UrlPresignedUploadProps extends UploadBaseProps {
  options?: RequestPresigningArguments;
}

export class AWSProvider {
  private readonly SECRET_KEY: string = "";
  private readonly REGION: string = "";
  private readonly ACCESS_KEY_ID: string = "";

  constructor(props: AWSProviderProps) {
    Object.assign(this, props);
  }

  async presignedUrlUpload({
    bucket,
    file,
    key,
    options,
    accept,
  }: UrlPresignedUploadProps) {
    const mimeType = getValidMimeType(file, accept);

    const params = {
      object: {
        Bucket: bucket,
        Key: key,
        ContentType: mimeType,
      },
      credentials: {
        accessKeyId: this.ACCESS_KEY_ID,
        secretAccessKey: this.SECRET_KEY,
      },
      region: this.REGION,
    } satisfies S3Config;

    return await presignedUpload(file, params, options);
  }

  async chunkUpload({ bucket, file, key, accept }: UploadBaseProps) {
    const mimeType = getValidMimeType(file, accept);

    const params = {
      object: {
        Bucket: bucket,
        Key: key,
        ContentType: mimeType,
      },
      credentials: {
        accessKeyId: this.ACCESS_KEY_ID,
        secretAccessKey: this.SECRET_KEY,
      },
      region: this.REGION,
    } satisfies S3Config;

    const stream = await awsChunkUpload(file, params);

    return stream;
  }
}
