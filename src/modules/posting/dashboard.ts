export type PostedDashboardItem = {
  postedAt: string;
  views: number;
  orders: number;
  productName: string;
};

export function calculatePostedDashboardStats(items: PostedDashboardItem[], today = new Date()) {
  const dateKey = today.toISOString().slice(0, 10);
  const postedToday = items.filter((item) => item.postedAt.slice(0, 10) === dateKey).length;
  const bestByViews = [...items].sort((a, b) => b.views - a.views)[0];
  const bestByOrders = [...items].sort((a, b) => b.orders - a.orders)[0];

  return {
    postedToday,
    bestByViews: bestByViews ? bestByViews.productName : "",
    bestByOrders: bestByOrders ? bestByOrders.productName : ""
  };
}
