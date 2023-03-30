FROM node:alpine AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
# Install app dependencies
RUN npm install

COPY . .

# ENV DATABASE_URL="mysql://jsuser:11111111@localhost:3306/test1"
# ENV PORT="8080"

RUN npm run build
# RUN npx prisma generate

FROM node:alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE ${PORT}
CMD [ "npm", "run", "start:migrate:prod" ]