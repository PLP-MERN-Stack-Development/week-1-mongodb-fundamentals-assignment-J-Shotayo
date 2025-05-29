// MongoDB queries for Bookstore assignment

// Task 2: Basic CRUD Operations
const basicQueries = {
  // Finds all books in a specific genre
  findFictionBooks: function() {
    return db.books.find({ genre: "Fiction" });
  },

  // Finds books published after a certain year
  findBooksAfterYear: function(year) {
    return db.books.find({ published_year: { $gt: year } });
  },

  // Finds books by a specific author
  findBooksByAuthor: function(author) {
    return db.books.find({ author: author });
  },

  // Updates the price of a specific book
  updateBookPrice: function(title, newPrice) {
    return db.books.updateOne(
      { title: title },
      { $set: { price: newPrice } }
    );
  },

  // Deletes a book by its title
  deleteBookByTitle: function(title) {
    return db.books.deleteOne({ title: title });
  }
};


// Task 3: Advanced Queries
const advancedQueries = {
  // Finds books in stock and published after year
  findInStockAfterYear: function(year) {
    return db.books.find({ 
      in_stock: true, 
      published_year: { $gt: year } 
    });
  },

  // Projection - only returns title, author, and price
  getBooksProjection: function(genre) {
    return db.books.find(
      { genre: genre },
      { title: 1, author: 1, price: 1, _id: 0 }
    );
  },

  // Sorts books out by their price
  sortBooksByPrice: function(ascending = true) {
    return db.books.find().sort({ price: ascending ? 1 : -1 });
  },

  // Pagination
  getBooksPaginated: function(pageNumber, pageSize = 5) {
    return db.books.find()
             .skip((pageNumber - 1) * pageSize)
             .limit(pageSize);
  }
};


// Task 4: Aggregation Pipeline
const aggregations = {
  // Average price by genre
  averagePriceByGenre: function() {
    return db.books.aggregate([
      {
        $group: {
          _id: "$genre",
          averagePrice: { $avg: "$price" }
        }
      }
    ]);
  },

  // Authors with most books
  authorWithMostBooks: function() {
    return db.books.aggregate([
      {
        $group: {
          _id: "$author",
          bookCount: { $sum: 1 }
        }
      },
      { $sort: { bookCount: -1 } },
      { $limit: 1 }
    ]);
  },

  // gets Books by publication decade
  booksByDecade: function() {
    return db.books.aggregate([
      {
        $project: {
          decade: {
            $subtract: [
              "$published_year",
              { $mod: ["$published_year", 10] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$decade",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }
};

// Task 5: Indexing
const indexing = {
  // Creates index on title
  createTitleIndex: function() {
    return db.books.createIndex({ title: 1 });
  },

  // Creates compound index on author and published_year
  createAuthorYearIndex: function() {
    return db.books.createIndex({ author: 1, published_year: 1 });
  },

  // Explains queries
  explainTitleQuery: function(title) {
    return db.books.find({ title: title }).explain("executionStats");
  },

  explainAuthorYearQuery: function(author, year) {
    return db.books.find({ 
      author: author, 
      published_year: year 
    }).explain("executionStats");
  }
};

// Exported all queries for calling when needed in mongosh terminal
module.exports = {
  basicQueries,
  advancedQueries,
  aggregations,
  indexing
};