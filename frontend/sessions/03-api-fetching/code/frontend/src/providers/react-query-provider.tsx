import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes (How long the data is considered fresh)
			gcTime: 10 * 60 * 1000, // 10 minutes (How long the data stays in cache after usage)
			refetchOnWindowFocus: true,
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
		mutations: {
			retry: 1,
		},
	},
});

export const ReactQueryProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export default ReactQueryProvider;
