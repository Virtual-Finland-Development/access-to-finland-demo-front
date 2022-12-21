import axiosInstance from '../axiosInstance';

// endpoints
import { TESTBED_API_BASE_URL } from '../endpoints';

// types
import {
  JobPostingsRequestPayload,
  JobPostingsResponse,
} from '../../components/TmtPage/types';

export async function getJobPostings(
  payload: JobPostingsRequestPayload
): Promise<JobPostingsResponse> {
  const { data } = await axiosInstance.post(
    `${TESTBED_API_BASE_URL}/testbed/productizers/find-job-postings`,
    payload
  );
  return data;
}
