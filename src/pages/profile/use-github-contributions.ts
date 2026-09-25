import { useEffect, useState } from 'react';
import type { Activity } from 'react-activity-calendar';

// Third-party mirror of GitHub's contribution graph; needs no token.
const API_URL = 'https://github-contributions-api.jogruber.de/v4/';

type ContributionsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: Activity[] };

/** The user's daily GitHub contributions over the last year. */
export function useGitHubContributions(username: string): ContributionsState {
  const [state, setState] = useState<ContributionsState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetch(`${API_URL}${username}?y=last`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ contributions: Activity[] }>;
      })
      .then(({ contributions }) => setState({ status: 'ready', data: contributions }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.error(error);
          setState({ status: 'error' });
        }
      });

    return () => controller.abort();
  }, [username]);

  return state;
}
