import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

import {
  createOriginAccessIdentity,
  createBucket,
  createCloudFrontDistribution,
} from '../resources';

function promiseOf<T>(output: pulumi.Output<T>): Promise<T> {
  return new Promise(resolve => output.apply(resolve));
}

pulumi.runtime.setMocks({
  // Mock requests to provision cloud resources and return a canned response.
  newResource: (
    args: pulumi.runtime.MockResourceArgs
  ): { id: string; state: any } => {
    // Here, we're returning a same-shaped object for all resource types.
    // We could, however, use the arguments passed into this function to
    // customize the mocked-out properties of a particular resource based
    // on its type. See the unit-testing docs for details:
    // https://www.pulumi.com/docs/guides/testing/unit
    // console.log(args.type);
    switch (args.type) {
      case 'aws:cloudfront/distribution:Distribution':
        return {
          id: `${args.name}_id`,
          state: {
            ...args,
            arn: 'arn:aws:some-cert-arn',
          },
        };
      default:
        return {
          id: `${args.name}_id`,
          state: args.inputs,
        };
    }
  },
  // Mock function calls and return whatever input properties were provided.
  call: (args: pulumi.runtime.MockCallArgs) => {
    return args.inputs;
  },
});

describe('Infrastructure tests', () => {
  let bucket: aws.s3.Bucket;
  let originAccessIdentity: aws.cloudfront.OriginAccessIdentity;
  let cloudFrontDistribution: aws.cloudfront.Distribution;

  beforeAll(async () => {
    // It's important to import the program _after_ the mocks are defined.
    const bucketName = 'test-bucket';

    originAccessIdentity = createOriginAccessIdentity(bucketName);

    bucket = createBucket('test-bucket');

    cloudFrontDistribution = createCloudFrontDistribution({
      bucketResource: bucket,
      originAccessIdentity,
      bucketName,
    });
  });

  test('Some simple bucket & cloud front tests.', async () => {
    const originAccessIdentityName = await promiseOf(originAccessIdentity.id);
    expect(originAccessIdentityName).toBe(
      'test-bucket-origin-access-identity_id'
    );

    const bucketName = await promiseOf(bucket.id);
    expect(bucketName).toBe('test-bucket_id');

    const certArn = await promiseOf(cloudFrontDistribution.arn);
    expect(certArn).toBe('arn:aws:some-cert-arn');
  });
});
