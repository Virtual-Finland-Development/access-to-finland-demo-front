import axiosInstance from '../axiosInstance';

// endpoints
import { TESTBED_API_BASE_URL } from '../endpoints';

// types
import {
  JmfRecommendationsRequestPayload,
  JmfRecommendationsResponse,
} from '../../@types';
import {
  JobPostingsRequestPayload,
  JobPostingsResponse,
} from '../../components/VacanciesPage/types';

export async function getJobPostings(
  payload: JobPostingsRequestPayload
): Promise<JobPostingsResponse> {
  const { data } = await axiosInstance.post(
    `${TESTBED_API_BASE_URL}/testbed/productizers/find-job-postings`,
    payload
  );
  return data;
}

/**
 * Signal wake up to the testbed API
 *
 * @returns
 */
export async function wakeup() {
  return axiosInstance.get(`${TESTBED_API_BASE_URL}/wake-up`);
}

export async function getJmfRecommendations(
  payload: JmfRecommendationsRequestPayload
): Promise<JmfRecommendationsResponse> {
  const { data } = await axiosInstance.post(
    `${TESTBED_API_BASE_URL}/jmf/recommendations`,
    payload
  );
  return data;
}
