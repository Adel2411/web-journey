# Backend Dockerfile
FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5000

# Wait for database and run migrations, then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
