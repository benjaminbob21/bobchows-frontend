import { Order } from "@/types";
import { Separator } from "./ui/separator";

type Props = {
  order: Order;
};

const OrderStatusDetail = ({ order }: Props) => {
  const isGroupOrder = !!order.paidParticipants;

  const renderDeliveringTo = () => {
    if (isGroupOrder) {
      const names = order.paidParticipants
        .map((p) => p.user?.name || "Guest")
        .filter(Boolean);
      const display = names.length > 0 ? names.join(", ") : "No one yet";
      return (
        <div className="flex flex-col">
          <span className="font-bold">Delivering to:</span>
          <span>{display}</span>
          <span className="text-sm text-gray-500">
            {names.length}/{order.totalParticipants} joined
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col">
        <span className="font-bold">Delivering to:</span>
        <span>{order.deliveryDetails?.name || "Not set yet"}</span>
        <span>
          {order.deliveryDetails?.addressLine1 || "—"},{" "}
          {order.deliveryDetails?.city || "—"}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {renderDeliveringTo()}
      <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <ul>
          {order.cartItems.map((item) => (
            <li>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="font-bold">Total</span>
        <span>${((order.totalAmount || 0) / 100).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderStatusDetail;
