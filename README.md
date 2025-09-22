# Edviron Payment Gateway Assessment
This project implements a payment flow using a React (Vite) frontend and a Node.js (Express + MongoDB) backend.
It supports:

- Creating payment orders

- Polling transaction status every 15s (in case webhooks are not triggered)

- Webhook endpoint for receiving payment status updates

- Saving orders and statuses in MongoDB

### Documentation:
Link: https://edviron-gateway-backend.vercel.app/docs

## Screenshots & Demo


https://github.com/user-attachments/assets/3281edaa-63e7-4fd2-8661-3cb62dfd6caf



https://github.com/user-attachments/assets/7cbc55cb-4ab5-47dd-906f-a835f18e810c



## Features

- React (Vite) Frontend

- Initiates payment requests

-Redirects users to the payment URL

- Displays status updates

  ### Node.js Backend

- /payments/create-payment → Creates payment link

- /webhook → Listens for payment gateway callbacks

- Automatic polling of payment status every 15s if webhook not received

- MongoDB models for Order, OrderStatus, and WebhookLog

## Tech Stack

- Frontend: React (Vite), Tailwind CSS

- Backend: Node.js, Express.js

- Database: MongoDB (Mongoose)

- Payments: Cashfree (or Edviron Gateway API)

- Deployment: Vercel (Frontend), (Backend optional: Vercel/Render/Heroku)

⚙️ Installation
Clone the repo
``` bash
git clone https://github.com/your-username/payment-gateway.git
cd payment-gateway
```

Backend Setup
```
cd backend
npm install
```


Create .env file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/payments
CASHFREE_API_KEY=your_cashfree_key
CASHFREE_SECRET=your_cashfree_secret
BASE_URL=https://dev-payments.edviron.com
```

Run backend:
```
npm run dev
```
Frontend Setup
```
cd frontend
npm install
```

Create .env file:
```
VITE_BACKEND_URL=http://localhost:5000

```
Run frontend:
```
npm run dev
```
🔗 API Endpoints
Create Payment
```
POST /payments/create-payment
```

Response:
```javascript
{
  "ok": true,
  "payment_url": "https://gateway-url.com/payment/123",
  "collect_request_id": "12345",
  "raw": { ... }
}
```
Webhook (from Gateway)
POST /webhook


Payload example:
```javascript
{
  "order_id": "abc123",
  "status": "SUCCESS",
  "payment_mode": "UPI",
  "transaction_amount": 500
}
  ```
Polling Status

Runs automatically every 15 seconds (via cron + pollTransaction.js).

## Logs

WebhookLog: Stores all incoming webhook payloads

Order: Stores created payment orders

OrderStatus: Stores transaction updates

 ## Deployment Notes

Frontend: Deploy to Vercel → set VITE_BACKEND_URL to your backend API

Backend: Can be deployed on Render/Heroku/AWS (must expose /payments/create-payment and /webhook)

Ensure MongoDB is accessible (use Atlas in production)

Configure webhook URL in Cashfree dashboard → point it to https://your-backend.com/webhook
