import { useGetGroupOrders } from "@/api/OrderApi";
import LottieAnimation from "@/components/Load";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const GroupOrderStatusPage = () => {
  const { groupOrder, isLoading } = useGetGroupOrders();

  if (isLoading) {
    return <LottieAnimation />;
  }

  if (!groupOrder || groupOrder.length === 0) {
    return "No group orders found";
  }

  return (
    <>
      <p className="text-4xl font-bold tracking-tighter mb-5">Group Orders</p>
      <div className="space-y-10">
        {groupOrder.map((order) => (
          <div className="space-y-10 bg-gray-50 p-10 rounded-lg">
            <OrderStatusHeader order={order} />
            <div className="grid gap-10 md:grid-cols-2">
              <OrderStatusDetail order={order} />
              <AspectRatio ratio={16 / 5}>
                <img
                  src={order.restaurant.imageUrl}
                  className="rounded-md object-cover h-full w-full"
                />
              </AspectRatio>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GroupOrderStatusPage;
