import { useGetReviews} from "@/api/MyRestaurantApi";
import { useGetRestaurant } from "@/api/RestaurantApi";
import { CircleUserRound, Star } from "lucide-react";
import { useParams } from "react-router-dom";

const DisplayReview = () => {
    const { restaurantId } = useParams();
    const { restaurant} = useGetRestaurant(restaurantId);
    const { reviews,
    isLoading: isLoadingReviews,
    error,
  } = useGetReviews(restaurantId);

  if (isLoadingReviews) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p>Error loading reviews: {error as string}</p>;
  }

  if (!reviews || reviews.length === 0) {
    return <p>Be the first to leave a review.</p>;
  }
  return (
    <div className="reviews-container">
          <h3 className="text-lg font-semibold mb-4">Reviews({restaurant?.reviewCount})</h3>
      {reviews.map((review) => (
        <div className="review-item mb-4 p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center">
            <CircleUserRound className="text-purple-500" />
            <p>&nbsp;&nbsp;</p>
            <span className="font-semibold">{review.name}</span>{" "}
            <span className="ml-auto">
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`cursor-pointer ${
                      star <= review.rating
                        ? "text-yellow-700 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </span>{" "}
          </div>
          <p className="mb-2 text-sm font-medium text-gray-500">
            Reviewed in {review.city}, {review.country} on{" "}
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>{review.comment}</p>{" "}
        </div>
      ))}
    </div>
  );
};

export default DisplayReview;
