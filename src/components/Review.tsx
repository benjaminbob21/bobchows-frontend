import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSubmitReview } from "@/api/MyRestaurantApi";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";


const Review = () => {
  const { restaurantId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { updateReview, isLoading } = useSubmitReview();
  const queryClient = useQueryClient();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) {
      toast.error("Error submitting review");
      return;
    }
    try {
      await updateReview({ restaurantId, rating, comment });
      await queryClient.invalidateQueries(["getReviews", restaurantId]);
      await queryClient.invalidateQueries("fetchRestaurant");

      setRating(0);
      setComment("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`cursor-pointer ${
                star <= rating
                  ? "text-yellow-700 fill-yellow-500"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <Textarea
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setComment(e.target.value)
          }
          placeholder="Write your review here..."
          className="mb-2"
        />
        <Button
          type="submit"
          disabled={isLoading || rating === 0 || comment.trim() === ""}
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
};

export default Review;
