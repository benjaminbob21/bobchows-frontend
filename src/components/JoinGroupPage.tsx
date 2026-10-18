import { useGetLinkAndOrder, useJoinGroupOrder } from "@/api/OrderApi";
import CheckoutButton from "./CheckoutButton";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { ShareGroupOrder } from "./ShareGroupOrder";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChefHat, Clock, DollarSign, MapPin, Users } from "lucide-react";
import LottieAnimation from "./Load";

const JoinGroupPage = () => {
  const { user } = useAuth0();
  const { joinGroupOrder, isLoading } = useJoinGroupOrder();
  const { groupOrderId } = useParams();
  const [showGroupOrderDialog, setShowGroupOrderDialog] = useState(false);
  const { getLink, isLoading: isLinkLoading } = useGetLinkAndOrder();
  const [groupOrderData, setGroupOrderData] = useState<{
    shareableLink: string;
    groupOrder: any;
    id: string;
  } | null>(null);

  useEffect(() => {
    const fetchGroupOrderData = async () => {
      try {
        const checkoutData = {
          groupOrderId: groupOrderId,
        };
        const data = await getLink(checkoutData);
        setGroupOrderData({
          shareableLink: data.shareableLink,
          groupOrder: data.groupOrder,
          id: data.id,
        });
      } catch (error) {
        console.error("Error fetching group order data:", error);
      }
    };

    fetchGroupOrderData();
  }, [groupOrderId, getLink]);

  const onCheckout = async (userFormData: UserFormData) => {
    const checkoutData = {
      deliveryDetails: {
        name: userFormData.name,
        addressLine1: userFormData.addressLine1,
        city: userFormData.city,
        country: userFormData.country,
        email: userFormData.email as string,
      },
      userId: user?.sub,
      groupOrderId: groupOrderId,
    };

    const data = await joinGroupOrder(checkoutData);
    window.location.href = data.url;
  };

  if (isLoading || isLinkLoading) {
    return <LottieAnimation />;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {groupOrderData && (
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {`Join ${groupOrderData.groupOrder.initiatorName}'s Group Order`}
            </h1>
          )}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share the joy of a delicious meal with friends and save on delivery!
            Join this group order and enjoy great food together.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Benefits Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Why Join a Group Order?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Save on Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Split delivery costs with the group
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Order Together</h3>
                  <p className="text-sm text-gray-600">
                    Enjoy a shared meal experience
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Coordinated Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Everyone gets their food at the same time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <ChefHat className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  {groupOrderData && (
                    <h3 className="font-semibold">
                      {groupOrderData.groupOrder.restaurantName}
                    </h3>
                  )}
                  <p className="text-sm text-gray-600">
                    Join the feast with great food
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <MapPin className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  {groupOrderData && (
                    <h3 className="font-semibold">
                      {groupOrderData.groupOrder.deliveryDetails.addressLine1}
                    </h3>
                  )}
                  <p className="text-sm text-gray-600">Shared delivery point</p>
                </div>
              </div>

              {/* Join Button - Prominent placement */}
              <div className="mt-6 flex justify-center">
                <Button
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg transform transition hover:-translate-y-0.5"
                  onClick={() => {
                    setShowGroupOrderDialog(true);
                  }}
                  disabled={isLinkLoading}
                >
                  {isLinkLoading ? "Joining group..." : "Join Group Order"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-500 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold mb-2">Join the Group</h3>
              <p className="text-sm text-gray-600">
                Click the join button and become part of the group order
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-500 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold mb-2">Contribute your Share</h3>
              <p className="text-sm text-gray-600">
                Navigate to checkout and pay your share of the group order
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-500 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold mb-2">Enjoy Together</h3>
              <p className="text-sm text-gray-600">
                Your food will arrive with the group delivery
              </p>
            </div>
          </div>
        </div>

        {/* Dialog */}
        <Dialog
          open={showGroupOrderDialog}
          onOpenChange={setShowGroupOrderDialog}
        >
          <DialogContent className="sm:max-w-md">
            {groupOrderData && (
              <div className="items-center">
                {groupOrderData.groupOrder.paidParticipants.length >= 3 && (
                  <DialogTitle className="font-bold text-center">
                    {groupOrderData.groupOrder.initiatorName} is inviting you..
                  </DialogTitle>
                )}
                <ShareGroupOrder
                  shareableLink={groupOrderData.shareableLink}
                  groupOrder={groupOrderData.groupOrder}
                />
                <div className="text-center pt-5">
                  <CheckoutButton
                    disabled={false}
                    onCheckout={onCheckout}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JoinGroupPage;
