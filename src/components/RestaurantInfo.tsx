import { Restaurant } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Dot, Star } from "lucide-react";

type Props = {
  restaurant: Restaurant;
};

const RestaurantInfo = ({ restaurant }: Props) => {
  return (
    <Card className="border-sla">
      <CardHeader>
        <CardTitle className="flex justify-between text-3xl fond-bold tracking-tight">
          {restaurant.restaurantName}
          <div>
            <div className="flex mb-2 text-xl">
              {(restaurant.averageRating).toFixed(1)}&nbsp;
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`cursor-pointer ${
                    star <= restaurant.averageRating
                      ? "text-yellow-700 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
              ({restaurant.reviewCount})
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          {restaurant.city}, {restaurant.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex">
        {restaurant.cuisines.map((item, index) => (
          <span className="flex">
            <span>{item}</span>
            {index < restaurant.cuisines.length - 1 && <Dot />}
          </span>
        ))}
      </CardContent>
    </Card>
  );
};

export default RestaurantInfo;
