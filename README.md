# Buy Sell @ IIITH

## Overview
- A full-stack web application for buying and selling items.
- Authentication via manual login (with Google reCAPTCHA) and CAS SSO.
- Backend endpoints for user registration, login, item management, cart, and orders.

## Frontend Pages
- **Login Page (login.jsx):**  
  - Manual login with reCAPTCHA.
  - Option to login via CAS.
- **Register Page (register.jsx):**  
  - Standard registration for new users.
- **CAS Registration (RegisterCAS.jsx):**  
  - Complete registration for users signing up via CAS.
- **Dashboard (dashboard.jsx):**  
  - Entire user profile with an option to update details.
- **Search Page (search.jsx):**  
  - Browse items which other users upload.
  - Filter based searching
- **Item Details (item.jsx):**  
  - View detailed info about individual items.
- **Cart Page (cart.jsx):**  
  - Manage items added to the cart.
- **Order & Delivery (deliver.jsx):**  
  - Process and coordinate delivery via OTP validation.
- **Order History (history.jsx):**  
  - Track pending orders, sold and bought items.
- **Add Item (add-items.jsx):**  
  - Form to list a new item for sale.
- **My Items (my-items.jsx):**  
  - Manage items listed by the logged-in user.
- **Support (support.jsx):**  
  - Chatbot support built on generative AI for assistance.

## Backend Highlights
- **Authentication:**  
  - JWT-based session management.
  - CAS integration with redirection and on-demand registration.
- **Security:**  
  - Google reCAPTCHA verification.
  - Environment-variable driven secrets (JWT, reCAPTCHA).
- **Item & Order Management:**  
  - Create, list, and remove items.
  - Add to cart, checkout, and OTP-based delivery confirmation.
- **Rating System:**  
  - Vendor ratings with user-submitted reviews.

## Additional Notes
- Incorporates Express, MongoDB, and session support.
- API endpoints protect sensitive transactions using cookies and JWTs.
