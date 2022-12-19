import axiosInstance from '../axiosInstance';

// endpoints
import { TESTBED_API_BASE_URL } from '../endpoints';

// types
import { JobPostingsRequestPayload } from '../../components/TmtPage/types';

export async function getJobPostings(payload: JobPostingsRequestPayload) {
  return axiosInstance.post(
    `${TESTBED_API_BASE_URL}/testbed/productizers/find-job-postings`,
    payload
  );
}

/**
 * Signal wake up to the testbed API
 *
 * @returns
 */
export async function wakeup() {
  return axiosInstance.get(`${TESTBED_API_BASE_URL}/wake-up`);
}
