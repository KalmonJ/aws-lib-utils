import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getObjectUrl } from "../../utils/get-object-url";

export type S3ClientConfig = ConstructorParameters<typeof S3Client>[number];

export type PutObjectCommandConfig = ConstructorParameters<
  typeof PutObjectCommand
>[number];

export type S3Config = S3ClientConfig & {
  object: PutObjectCommandConfig;
};

export type RequestPresigningArguments = Parameters<typeof getSignedUrl>[2];

export async function presignedUrlUpload(
  file: File | null,
  props: S3Config,
  presigningArguments: RequestPresigningArguments
) {
  if (!file) return null;

  if (!props.object.Body) throw new Error("Missing bucket name");

  const client = new S3Client(props);
  const command = new PutObjectCommand(props.object);

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 3600,
    ...presigningArguments,
  });

  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Length": file.size.toString(),
    },
    body: file,
  });

  if (!response.ok) throw new Error(response.statusText);

  return {
    success: true,
    url: getObjectUrl(
      props.object.Bucket!,
      props.region as string,
      props.object.Key as string
    ),
  };
}
