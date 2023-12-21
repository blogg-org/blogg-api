# blogg-api

Backend for the blog web application **blogg**. I created this project while learning MERN (MongoDB, Express, React, Node).

## Data Modeling

![blogg data modeling](https://github.com/blogg-org/blogg-api/assets/45593423/c12a0e2f-4707-4b5e-9c4a-3135d8395c33)



## Application Setup

Make sure that ```git``` and ```node``` is already installed into your system.

- Clone github repository.
  
  ```bash
  git clone git@github.com:blogg-org/blogg-api.git
  ```

- install dependencies.
  
  ```bash
  npm install
  ```
  
- Create a ```.env``` file in root directory and fill all environment variables accordingly as specified in ```.env.sample``` or you can copy environment variables from here.

  ```bash
  PORT=8000
  MONGO_URI="MongoDB database URI where the database of the project is hosted"
  CORS_ORIGINS="localhost and/or hosted url of frontend of this project"

  ACCESS_TOKEN_SECRET="long random string, you can generate one using command 'openssl rand -base64 32' 
                    if openssl is installed in your system or you can google and know how to do it"    
  ACCESS_TOKEN_EXPIRY=1d
  REFRESH_TOKEN_SECRET="use the same process as you do to generate string for ACCESS_TOKEN_SECRET and I 
                    suggest you to use different string than ACCESS_TOKEN_SECRET"
  REFRESH_TOKEN_EXPIRY=10d

  CLOUDINARY_CLOUD_NAME=""
  CLOUDINARY_API_KEY=""
  CLOUDINARY_API_SECRET=""

  TOTP_ISSUER=""
  TOTP_SECRET=""

  EMAIL_TRANSPORTER_AUTH_USER=""
  EMAIL_TRANSPORTER_AUTH_PASS=""
  EMAIL_SEND_FROM=""

  GOOGLE_OAUTH_CLIENT_ID=""
  GOOGLE_OAUTH_CLIENT_SECRET=""
  ```

- Run node server.
  
  ```bash
  npm run dev
  ```
  
## Deployments

1. **backend:** [https://blogg-api-jqfl.onrender.com/](https://blogg-api-jqfl.onrender.com/)
   
   It uses free plan from render.com for deployment. So, it may take longer time to start server for the first time because the server goes into sleep mode when server is inactive for a long time.

2. **frontend:** [https://blogg-web.vercel.app/](https://blogg-web.vercel.app/)

   Code for the frontend can be found at [https://github.com/blogg-org/blogg-web](https://github.com/blogg-org/blogg-web)

## Dependencies

- **bcriptjs**: encrypt and compare passwords.
- **cloudinary**: cloudinary sdk for avatar and blog's featured image storage and manipulation.
- **express-rate-limit**: limit users for accessing resources with specific count in given time window.
- **google-auth-library**: custom backend implementation for google oauth.
- **jsonwebtoken**: authentication and authorization using access and refresh jwt tokens.
- **mongoose**: MongoDB ORM for node.
- **multer**: nodejs middleware for uploading files i.e. multipart/form-data.
- **nodemailer**: setup mail server and send mail using node.
- **otpauth**: OTP generation and verification.
