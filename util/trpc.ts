import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../smart-cube_server";
import { apiUrl } from "../config";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: apiUrl,
    }),
  ],
});

export default trpc;
