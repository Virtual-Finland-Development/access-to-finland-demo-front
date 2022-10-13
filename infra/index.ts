/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createOriginAccessIdentity,
  createBucket,
  createBucketPolicy,
  createCloudFrontDistribution,
  uploadAssetsToBucket,
} from './resources';

const BUCKET_NAME = 'access-to-finland-demo';

// create origin access identity
const originAccessIdentity = createOriginAccessIdentity(BUCKET_NAME);

// create bucket
const bucket = createBucket(BUCKET_NAME);

// create bucket policy
const bucketPolicy = createBucketPolicy({
  bucketResource: bucket,
  originAccessIdentity,
  bucketName: BUCKET_NAME,
});

// create cloud front distribution
const cloudFrontDistribution = createCloudFrontDistribution({
  bucketResource: bucket,
  originAccessIdentity,
  bucketName: BUCKET_NAME,
});

// upload built assets to created bucket
uploadAssetsToBucket(bucket);
