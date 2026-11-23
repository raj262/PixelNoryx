import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const STORAGE_BUCKETS = {
  assets: "assets",
  media: "media",
} as const;

export type StorageBucket = keyof typeof STORAGE_BUCKETS;

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name} — run \`neon login\` then \`neon deploy\` to pull Object Storage credentials.`);
  }
  return value;
}

export function isStorageConfigured() {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID?.trim() &&
      process.env.AWS_SECRET_ACCESS_KEY?.trim() &&
      process.env.AWS_ENDPOINT_URL_S3?.trim() &&
      process.env.AWS_REGION?.trim()
  );
}

export function getS3Client() {
  return new S3Client({
    region: requiredEnv("AWS_REGION"),
    endpoint: requiredEnv("AWS_ENDPOINT_URL_S3"),
    forcePathStyle: true, // required for Neon Object Storage
    credentials: {
      accessKeyId: requiredEnv("AWS_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("AWS_SECRET_ACCESS_KEY"),
    },
  });
}

export function publicObjectUrl(bucket: StorageBucket, key: string) {
  const endpoint = requiredEnv("AWS_ENDPOINT_URL_S3").replace(/\/$/, "");
  return `${endpoint}/${STORAGE_BUCKETS[bucket]}/${key.replace(/^\//, "")}`;
}

export async function uploadObject(options: {
  bucket: StorageBucket;
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
}) {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKETS[options.bucket],
      Key: options.key,
      Body: options.body,
      ContentType: options.contentType ?? "application/octet-stream",
      CacheControl:
        options.bucket === "media"
          ? "public, max-age=31536000, immutable"
          : "private, max-age=3600",
    })
  );

  return {
    key: options.key,
    bucket: STORAGE_BUCKETS[options.bucket],
    url:
      options.bucket === "media"
        ? publicObjectUrl(options.bucket, options.key)
        : await getSignedUrl(
            client,
            new GetObjectCommand({
              Bucket: STORAGE_BUCKETS[options.bucket],
              Key: options.key,
            }),
            { expiresIn: 3600 }
          ),
  };
}

export async function deleteObject(bucket: StorageBucket, key: string) {
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: STORAGE_BUCKETS[bucket],
      Key: key,
    })
  );
}

/** Smoke-test Object Storage credentials / buckets. */
export async function probeStorage() {
  if (!isStorageConfigured()) {
    return {
      ok: false as const,
      configured: false,
      message:
        "Object Storage env vars missing. Run neon login + neon deploy (or neon env pull).",
    };
  }

  const client = getS3Client();
  const listed = await client.send(new ListBucketsCommand({}));
  const names = (listed.Buckets ?? []).map((b) => b.Name).filter(Boolean);

  for (const bucket of Object.values(STORAGE_BUCKETS)) {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
  }

  const key = `healthchecks/${Date.now()}.txt`;
  const body = `pixelnoryx-storage-ok ${new Date().toISOString()}`;
  const uploaded = await uploadObject({
    bucket: "media",
    key,
    body,
    contentType: "text/plain",
  });
  await deleteObject("media", key);

  return {
    ok: true as const,
    configured: true,
    buckets: names,
    uploaded,
  };
}
