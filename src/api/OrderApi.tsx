import { GroupOrder, Order } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get orders");
    }

    return response.json();
  };

  const { data: orders, isLoading } = useQuery(
    "fetchMyOrders",
    getMyOrdersRequest,
    { refetchInterval: 5000 }
  );

  return { orders, isLoading };
};

export const useGetGroupOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getGroupOrdersRequest = async (): Promise<GroupOrder[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/order/get-group`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get group orders");
    }

    return response.json();
  };

  const { data: groupOrder, isLoading } = useQuery(
    "fetchGroupOrders",
    getGroupOrdersRequest,
    { refetchInterval: 5000 }
  );

  return { groupOrder, isLoading };
};

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
  groupOrderId?: string;
};

type GroupOrderRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  restaurantId: string;
};

type JoinOrderRequest = {
  deliveryDetails: {
    email: string;
    name: string;
  };
  userId?: string;
  groupOrderId?: string;
};

export const useCreateGroupOrder = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createGroupOrderRequest = async (
    groupOrderRequest: GroupOrderRequest
  ) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/order/group`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupOrderRequest),
    });

    if (!response.ok) {
      throw new Error("Unable to create group order");
    }

    return response.json();
  };

  const {
    mutateAsync: createGroupOrder,
    isLoading,
    error,
    reset,
  } = useMutation(createGroupOrderRequest);

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return {
    createGroupOrder,
    isLoading,
  };
};

type getLink = {
  groupOrderId?: string;
};

export const useGetLinkAndOrder = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getLinkAndOrder = async (getLinkRequest: getLink) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/order/get-link`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getLinkRequest),
    });

    if (!response.ok) {
      throw new Error("Unable to get link and order");
    }

    return response.json();
  };

  const {
    mutateAsync: getLink,
    isLoading,
    error,
    reset,
  } = useMutation(getLinkAndOrder);

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return {
    getLink,
    isLoading,
  };
};

export const useJoinGroupOrder = () => {
  const { getAccessTokenSilently } = useAuth0();

  const joinOrderRequest = async (groupOrderRequest: JoinOrderRequest) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/order/join-group/${groupOrderRequest.groupOrderId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupOrderRequest),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Unable to join group order");
    }

    return response.json();
  };

  const {
    mutateAsync: joinGroupOrder,
    isLoading,
    error,
    reset,
  } = useMutation(joinOrderRequest);

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return {
    joinGroupOrder,
    isLoading,
  };
};

export const useCreateCheckoutSession = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createCheckoutSessionRequest = async (
    checkoutSessionRequest: CheckoutSessionRequest
  ) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/order/checkout/create-checkout-session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutSessionRequest),
      }
    );

    if (!response.ok) {
      throw new Error("Unable to create checkout session");
    }

    return response.json();
  };

  const {
    mutateAsync: createCheckoutSession,
    isLoading,
    error,
    reset,
  } = useMutation(createCheckoutSessionRequest);

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return {
    createCheckoutSession,
    isLoading,
  };
};
