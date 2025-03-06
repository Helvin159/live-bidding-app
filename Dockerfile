FROM node:18-alpine

COPY .next /app/
COPY public /app/
COPY server /app/
COPY src /app/
COPY .env.local /app/
COPY eslint.config.mjs /app/
COPY next-env.d.ts /app/
COPY next.config.ts /app/
COPY nodemon.json /app/
COPY package.json /app/
COPY postcss.config.mjs /app/
COPY README.md /app/
COPY tailwind.config.ts /app/
COPY tsconfig.json /app/
COPY tsconfig.server.json /app/

WORKDIR /app

RUN npm install

CMD ["npx", "nodemon"]
