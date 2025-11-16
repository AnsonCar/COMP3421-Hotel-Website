```
npm install
npm run dev
```

```
open http://localhost:3000
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
