import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useStore<T>(key: string) {
  const PREFIX = "local-";
  const queryClient = useQueryClient();

  const setStore = (data: T) => {
    queryClient.setQueryData([PREFIX + key], data);
  };

  const { data: store } = useQuery<T>({
    queryKey: [PREFIX + key],
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    queryFn: () => null as T,
  });

  const remove = () => {
    queryClient.removeQueries({ queryKey: [PREFIX + key] });
  };

  return { store, setStore, remove };
}
