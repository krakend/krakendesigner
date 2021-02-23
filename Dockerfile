FROM nginx:alpine

COPY designer/ /usr/share/nginx/html

# Additional copy to check that the bundle has been correctly generated:
COPY designer/bundle.js /usr/share/nginx/html/
COPY designer/styles.css /usr/share/nginx/html/