## Background
As online booking platforms are growing rapidlyand becoming the trend, touristsare more willing to make reservationsthrough these platforms instead of booking byphonecall, whereonline platformsbring along with convenient, transparent, and trustworthy. New York City is one of the heat tourism spotsamong USA province, with millions of domestic  and  international  visitors  every  year.Despite  there  are variety  of  hostel booking platform, only a few even none of them focuses on the quality of the hotels.In this project, thewebsite is designed to provide a comprehensive booking  system andserve travelers seeking premium hotel accommodationsin New York City.

## Purposes
### High-classHotel Reservation ServiceThe 
platform exclusively focuseson 4-star and above hotels in New York City to ensure a qualified selection that satisfies the needs of high-spending customers.Partner hotels will  be  verifiedin  order  toensureauthenticity,  high-quality  imagery,  and  consistent service standards.

### Seamless Transactions Experience
The platform will provide secure, fast, and user-friendly booking processes, minimizing steps from search to confirmation. Reliable and general payment methods and gateways will  be  integrated intothe  platform.Automated  confirmation  emailsandreceipts featureswill ensure smooth post-booking communication.

## Potential Stakeholders
### Travelers/ Customers
High-spending individuals seeking reliable and premium booking services.

### Hotel Partners(4-star and above in NYC)
Businesses listing their properties on the platform.

## Client-SideComponents
### Architecture
- Frontend Layer
This  handles what  users  can find  and  seeonthe  website  and  interaction with  the  site,such  as searching  hotels,  making  bookings,  and  managing accounts. It visualises the backend datain order todisplay the corresponding account information and hotel details.

- Backend Layer
The backend plays an important role as a bridge between the frontend and the database, which is responsible for processing requests, performing logic, and sending structured data back to the frontend.

- Database Layer
This layer'sgoal is to store and retrieve hotel listings, user info, and bookrecords while  ensuringhigh  data  integrity  and  quick  access  during  user operations.Figure 1Website Architecture

### Server-SideComponents
```ts
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

type BookingStatus = 'pending' | 'confirmed';

type Bookings = {
  booking_id: number;
  user_id: number;
  hotel_id: number;
  check_in_date: Date;
  check_out_date: Date;
  guests: number;
  status: BookingStatus;
};
```

```sql
CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Hotels (
    hotel_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    user_rating INT CHECK (user_rating BETWEEN 1 AND 5),
    room_type VARCHAR(25) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    description TEXT
);

CREATE TABLE Reviews (
    review_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    user_rating INT CHECK (user_rating BETWEEN 1 AND 5),
    comment TEXT,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id)
);

CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INT NOT NULL CHECK (guests > 0),
    status ENUM('pending', 'confirmed') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (hotel_id) REFERENCES Hotels(hotel_id),
    CHECK (check_out_date > check_in_date)
);
```