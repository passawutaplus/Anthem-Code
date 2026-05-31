import { useQuery } from "@tanstack/react-query";

// TODO: swap mocked collabs/hires to real counts when status enums stabilize.
export const useFeedStats = () =>
  useQuery({
    queryKey: ["feed-stats-mock"],
    staleTime: 60_000,
    queryFn: async () => {
      // Mock values per product spec — designers/projects/collabs/hires
      return {
        designers: 1284,
        projects: 3512,
        collabs: 482,
        hires: 196,
      };
    },
  });
