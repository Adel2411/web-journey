## 📝 Backend Challenge 1 - Summary

I started the challenge by setting up a PostgreSQL database and configuring the connection in my `.env` file.  
Then I built the Prisma schema for the `Note` model and initialized Prisma with the correct configuration.

After that, I implemented all the **CRUD operations** using Express and Prisma, and added **error handling** for both server errors and invalid requests (like missing required fields).

Once the routes were ready, I connected them to `app.js` and configured **CORS** to allow frontend access. I tested CORS using a `test.html` file that successfully fetched data from my backend server.

This was my first time using Prisma, so I faced some challenges while creating the CRUD logic — but I learned a lot through the process and got everything working smoothly in the end.

I also added **validations** for the `title` and `content` fields in both `POST` and `PUT` routes to ensure better data quality.  
And I implemented **pagination**, **search**, and **sorting** in the `GET /api/notes` endpoint.
