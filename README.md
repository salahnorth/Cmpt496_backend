# Cmpt496_backend
Commands to use:

# Installing the dependencies
npm init -y
npm install express cors puppeteer
npm install sqlite3

# Running the backend locally
node server.js

For displaying, adding and deleting items from the database, I used the Postman app so far, it goes like this:
1) We run node server.js
2) We open postman app and make the following requests:
	i) GET request to display the items in the database
	ii) POST request to add items to the database
	iii) DELETE request to delete items from the database
3) We open "http://localhost:3000/favourites" in the web browser to display the items in the database

# Scraping the top 100 movies
node imdbscraper.js