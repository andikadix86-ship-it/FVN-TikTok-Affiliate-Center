import { ProductSource } from "@/modules/affiliate/types";

export type ApiConnectionState = "Connected" | "Not Connected";

export type ApiStatus = {
  tiktokLogin: ApiConnectionState;
  tiktokDisplayApi: ApiConnectionState;
  tiktokShopApi: ApiConnectionState;
  productSource: ProductSource;
};

export function buildApiStatus({
  tiktokConnected,
  displayApiConnected,
  shopApiConnected,
  productSource
}: {
  tiktokConnected: boolean;
  displayApiConnected?: boolean;
  shopApiConnected?: boolean;
  productSource: ProductSource;
}): ApiStatus {
  return {
    tiktokLogin: tiktokConnected ? "Connected" : "Not Connected",
    tiktokDisplayApi: displayApiConnected ? "Connected" : "Not Connected",
    tiktokShopApi: shopApiConnected ? "Connected" : "Not Connected",
    productSource
  };
}
