/* eslint-disable @typescript-eslint/no-unused-vars */
import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as mime from 'mime';
import * as fs from 'fs';
import * as path from 'path';

const stack = pulumi.getStack();
const projectName = pulumi.getProject();

/**
 * TYPES
 */
interface BucketConfig {
  bucketResource: aws.s3.Bucket;
  originAccessIdentity: aws.cloudfront.OriginAccessIdentity;
  bucketName: string;
}

/**
 * PUBLIC
 */
export function createOriginAccessIdentity(bucketName: string) {
  const identity = getOriginAccessIdentity(bucketName);
  return identity;
}

export function createBucket(bucketName: string) {
  const bucket = getBucket(bucketName);
  return bucket;
}

export function createBucketPolicy(config: BucketConfig) {
  const bucketPolicy = getBucketPolicy(config);
  return bucketPolicy;
}

export function createCloudFrontDistribution(config: BucketConfig) {
  const cloudFrontDistribution = getCloudFrontDistribution(config);
  return cloudFrontDistribution;
}

export function uploadAssetsToBucket(bucketResource: aws.s3.Bucket) {
  process.chdir('../'); // navigate to root folder where build folder for react app is located
  const buildDir = `${process.cwd()}/build`;
  uploadToS3(buildDir, bucketResource);
}

/**
 * PRIVATE
 */
function publicReadPolicyForBucket(
  bucketName: string,
  originAccessArn: string
): string {
  return JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: {
          AWS: [`${originAccessArn}`],
        },
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  });
}

function uploadToS3(
  buildDir: string,
  bucket: aws.s3.Bucket,
  subDir: string = ''
) {
  for (let item of fs.readdirSync(`${buildDir}${subDir}`)) {
    const filePath = path.join(buildDir, subDir, item);

    if (fs.statSync(filePath).isDirectory()) {
      uploadToS3(buildDir, bucket, `${subDir}/${item}`);
    } else {
      const file = subDir.length > 0 ? `${subDir.slice(1)}/${item}` : item;
      const object = new aws.s3.BucketObject(file, {
        bucket: bucket,
        source: new pulumi.asset.FileAsset(filePath),
        contentType: mime.getType(filePath) || undefined,
        // https://create-react-app.dev/docs/production-build/#static-file-caching
        cacheControl:
          subDir.length > 0
            ? 'max-age=31536000'
            : `no-store, no-cache${file === 'index.html' ? ', max-age=0' : ''}`,
      });
    }
  }
}

function getOriginAccessIdentity(bucketName: string) {
  const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
    `${bucketName}-origin-access-identity`,
    {
      comment: `Access Identity for ${bucketName}`,
    }
  );

  return originAccessIdentity;
}

function getBucket(bucketName: string) {
  const bucket = new aws.s3.Bucket(bucketName, {
    website: {
      indexDocument: 'index.html',
      errorDocument: 'index.html',
    },
    tags: {
      'vfd:project': projectName,
      'vfd:stack': stack,
    },
  });

  return bucket;
}

function getBucketPolicy(config: BucketConfig) {
  const { bucketResource, originAccessIdentity, bucketName } = config;

  const bucketPolicy = new aws.s3.BucketPolicy(`${bucketName}-policy`, {
    bucket: bucketResource.bucket,
    policy: pulumi
      .all([bucketResource.bucket, originAccessIdentity.iamArn])
      .apply(([bucketName, originAccessArn]) =>
        publicReadPolicyForBucket(bucketName, originAccessArn)
      ),
  });

  return bucketPolicy;
}

function getCloudFrontDistribution(config: BucketConfig) {
  const { bucketResource, originAccessIdentity, bucketName } = config;

  const cloudFrontDistribution = new aws.cloudfront.Distribution(
    `${bucketName}-cdn`,
    {
      origins: [
        {
          domainName: bucketResource.bucketRegionalDomainName,
          originId: bucketResource.arn,
          s3OriginConfig: {
            originAccessIdentity:
              originAccessIdentity.cloudfrontAccessIdentityPath,
          },
        },
      ],
      customErrorResponses: [
        {
          errorCachingMinTtl: 300,
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCachingMinTtl: 300,
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
      defaultCacheBehavior: {
        allowedMethods: ['GET', 'HEAD'],
        cachedMethods: ['GET', 'HEAD'],
        targetOriginId: bucketResource.arn,
        viewerProtocolPolicy: 'redirect-to-https',
        forwardedValues: {
          cookies: {
            forward: 'none',
          },
          queryString: false,
        },
        minTtl: 0,
        defaultTtl: 3600,
        maxTtl: 86400,
      },
      viewerCertificate: {
        cloudfrontDefaultCertificate: true,
      },
      restrictions: {
        geoRestriction: {
          locations: [],
          restrictionType: 'none',
        },
      },
      defaultRootObject: 'index.html',
      httpVersion: 'http2',
      isIpv6Enabled: true,
      priceClass: 'PriceClass_All',
      waitForDeployment: true,
      enabled: true,
      retainOnDelete: false,
      tags: {
        'vfd:project': projectName,
        'vfd:stack': stack,
      },
    },
    {
      protect: true,
    }
  );

  return cloudFrontDistribution;
}
