type Hotels = {
  hotel_id: number;
  name: string;
  address: string;
  star_rating: 1 | 2 | 3 | 4 | 5;
  user_rating: 1 | 2 | 3 | 4 | 5;
  room_type: string;
  price_per_night: number;
  description: string | null;
};

type Users = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

type Reviews = {
  review_id: number;
  user_id: number;
  hotel_id: number;
  user_rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  time: Date;
};

type BookingStatus = "pending" | "confirmed";

type Bookings = {
  booking_id: number;
  user_id: number;
  hotel_id: number;
  check_in_date: Date;
  check_out_date: Date;
  guests: number;
  status: BookingStatus;
};
