import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../smart-cube_server";
import { apiUrl } from "../config";
import { getToken } from "./authToken";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: apiUrl + "/trpc",
      headers() {
        const token = getToken();
        if (token == null) return {};

        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});

export default trpc;
