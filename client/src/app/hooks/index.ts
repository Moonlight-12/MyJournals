import { useSession } from "next-auth/react";

export const useApiCall = () => {
  const { data: session } = useSession();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!session?.accessToken) {
      throw new Error('No authentication token available');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return { fetchWithAuth };
};