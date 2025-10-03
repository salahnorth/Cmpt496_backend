// dummy recommendations for now

function getRecommendations(req, res) {
	res.json([
		{ title: "The Matrix" },
		{ title: "Inception" },
		{ title: "Interstellar" }]);
}

module.exports = { getRecommendations };

