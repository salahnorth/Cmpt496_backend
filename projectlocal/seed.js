// seed.js
(async () => {
  try {
    console.log("Starting seeding...");

    require("./import_data/import_tmdb");
    require("./import_data/import_streaming");
    require("./import_data/import_googlebooks");
    require("./import_data/import_openlibrary");
    require("./import_data/import_eplbooks");

    console.log("Seeding done. Run `npm start` to start the server.");
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
})();
