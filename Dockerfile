FROM node:22-alpine AS css-build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY tailwind.config.js ./
COPY css/tailwind-input.css ./css/
COPY index.html ./
COPY js/ ./js/

RUN npx tailwindcss -i css/tailwind-input.css -o css/tailwind.css --minify

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/
COPY site.webmanifest /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY --from=css-build /build/css/tailwind.css /usr/share/nginx/html/css/tailwind.css
COPY js/ /usr/share/nginx/html/js/
COPY images/ /usr/share/nginx/html/images/

EXPOSE 80
