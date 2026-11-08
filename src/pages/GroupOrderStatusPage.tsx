import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConfirmGroupPayment, useGetGroupOrders } from "@/api/OrderApi";
import LottieAnimation from "@/components/Load";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const GroupOrderStatusPage = () => {
  const { groupOrder, isLoading } = useGetGroupOrders();
  const { confirmGroupPayment } = useConfirmGroupPayment();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const confirmStarted = useRef(false);

  useEffect(() => {
    const confirmPending = async () => {
      if (searchParams.get("success") !== "true") {
        return;
      }

      const groupOrderId = searchParams.get("groupOrderId");
      if (groupOrderId) {
        // Guard against React StrictMode double-firing this effect in dev,
        // which would send two concurrent confirm requests.
        if (confirmStarted.current) {
          return;
        }
        confirmStarted.current = true;
        try {
          await confirmGroupPayment(groupOrderId);
        } catch (error) {
          console.log(error);
        } finally {
          // Strip the ?success=true&groupOrderId=... params so the confirm
          // request is not re-fired every time this page remounts.
          navigate("/group-order-status", { replace: true });
        }
      }
    };

    confirmPending();
  }, [searchParams, confirmGroupPayment, navigate]);

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
          <div className="space-y-10 bg-gray-50 p-10 rounded-lg" key={order._id}>
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
