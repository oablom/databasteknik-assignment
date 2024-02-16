import PromptSync from "prompt-sync";
import movieDataLibrary from "./CreateDatabase.js";

const prompt = PromptSync({ sigint: true });

const allMovies = movieDataLibrary.find().exec();

async function AssignmentApp() {
	let choice;

	while (choice !== "5") {
		console.log("1. View all movies");
		console.log("2. Add a new movie");
		console.log(
			"3. Update a movie (Update title, director or release date, genres, rating, cast)"
		);
		console.log("4. Delete a movie");
		console.log("5. Exit");

		choice = prompt("Enter your choice: ");

		switch (choice) {
			case "1":
				await allMovies.then((movies) => {
					movies.map((movie) => {
						console.log(movie);
					});
				});

				break;
			case "2":
				// let validInput = false;
				// while (!validInput) {
				console.log();
				let title = "";
				while (title === "") {
					title = prompt("Enter new title: ");
					if (title === "") {
						console.log(
							"\nInvalid input, please try again and enter a title.\n"
						);
					}
				}
				// if (title === "escape") {
				// 	break;
				// }
				let director = "";
				while (director === "") {
					director = prompt("Enter new director: ");
					if (director === "") {
						console.log(
							"\nInvalid input, please try again and enter a director.\n"
						);
					}
				}
				let releaseYear = 0;
				// while (!isNaN(releaseYear < 1800) || !isNaN(releaseYear > 2024)) {
				while (releaseYear < 1800 || releaseYear > 2024 || isNaN(releaseYear)) {
					releaseYear = parseInt(prompt("Enter the release year: "));
					if (releaseYear < 1800 || releaseYear > 2024 || isNaN(releaseYear)) {
						// if (!isNaN(releaseYear <= 1800) || !isNaN(releaseYear >= 2024)) {
						console.log(
							"\nInvalid input, please try again and enter a year between 1800 and 2024.\n"
						);
					}
				}
				let genres;
				do {
					genres = prompt("Enter the genres (comma-separated): ")
						.trim()
						.split(",");
					if (genres.length === 0 || genres[0] === "") {
						console.log(
							"\nInvalid input, please try again and enter at least one genre. See the example below: \nAction, Sci-Fi, Thriller\nCrime, Drama, Thriller\nComedy, Drama, Romance\netc.\n"
						);
					}
				} while (genres.length === 0 || genres[0] === "");

				let ratings = [];
				while (ratings.length !== 3 || ratings.some(isNaN)) {
					ratings = prompt("Enter the (3) ratings (comma-separated): ")
						.trim()
						.split(",")
						.map(parseFloat);

					if (ratings.length !== 3 || ratings.some(isNaN)) {
						console.log(
							"\nInvalid input, please try again and enter 3 ratings separated by commas. See the example below: \n8.8, 4, 9.2\n9.3, 4.7, 9.6\n9, 4.8, 9.5\netc.\n"
						);
					}
				}
				// const ratings = parseFloat(
				// 	prompt("Enter the (3) ratings (comma-separated): ").trim().split(",")
				// );

				let cast;
				do {
					cast = prompt("Enter the cast (comma-separated): ").trim().split(",");
					if (cast.length === 0 || cast[0] === "") {
						console.log(
							"\nInvalid input, please try again and enter at least one cast member. See example below: \nLeonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page\nTim Robbins, Morgan Freeman, Bob Gunton\n"
						);
					}
				} while (cast.length === 0 || cast[0] === "");

				console.log(cast);

				movieDataLibrary.create({
					title: title,
					director: director,
					releaseYear: releaseYear,
					genres: genres,
					ratings: ratings,
					cast: cast,
				});

				console.log("\nFollowing movie added successfully!");
				console.log(
					"Title: " +
						title +
						"\nDirector: " +
						director +
						"\nRelease Year: " +
						releaseYear +
						"\nGenres: " +
						genres +
						"\nRatings: " +
						ratings +
						"\nCast: " +
						cast +
						"\n"
				);

				break;
			case "3":
				let movieTitleToUpdate = prompt(
					"Enter the title of the movie you want to update (case sensitive): "
				);
				let movieTitleToUpdateExists = await movieDataLibrary.findOne({
					title: movieTitleToUpdate,
				});

				if (movieTitleToUpdateExists) {
					console.log(
						"\n" + movieTitleToUpdate,
						"exists in the movie collection!",
						"\nMovie data:",
						"\nTitle: ",
						movieTitleToUpdateExists.title,
						"\nDirector: ",
						movieTitleToUpdateExists.director,
						"\nRelease Year: ",
						movieTitleToUpdateExists.releaseYear,
						"\nGenres: ",
						movieTitleToUpdateExists.genres,
						"\nRatings: ",
						movieTitleToUpdateExists.ratings,
						"\nCast: ",
						movieTitleToUpdateExists.cast,
						"\n"
					);

					let whatToUpdate = prompt(
						"What do you want to update? (title, director, release year, genres, rating, cast): "
					).toLowerCase();

					let updateSuccessfully = false;

					switch (whatToUpdate) {
						case "title":
							let newTitle = prompt("Enter the new title: ");
							if (newTitle.trim() === "") {
								console.log(
									"\nInvalid input! Title cannot be empty.\nI'm sending you back to the main menu!\n"
								);
								break;
							}
							updateSuccessfully = await movieDataLibrary.updateOne(
								{ title: movieTitleToUpdate },
								{ $set: { title: newTitle } }
							);
							if (updateSuccessfully) {
								console.log(
									"Title updated successfully from " +
										movieTitleToUpdate +
										" to " +
										newTitle +
										"!\n"
								);
							}
							break;
						case "director":
							let newDirector = prompt("Enter the new director: ");
							if (newDirector.trim() === "") {
								console.log(
									"\nInvalid input! Director cannot be empty.\nI'm sending you back to the main menu!\n"
								);
								break;
							}
							updateSuccessfully = await movieDataLibrary.updateOne(
								{ title: movieTitleToUpdate },
								{ $set: { director: newDirector } }
							);
							if (updateSuccessfully) {
								console.log(
									"\nDirector updated successfully from " +
										movieTitleToUpdate +
										" to " +
										newDirector +
										"!\n"
								);
							}
							break;
						case "release year":
							let newReleaseYear = parseInt(prompt("Enter new release year: "));
							if (
								isNaN(newReleaseYear) ||
								newReleaseYear < 1800 ||
								newReleaseYear > 2024
							) {
								console.log(
									"\nInvalid input! Please enter a valid release year between 1800 and 2024.\nI'm sending you back to the main menu!\n"
								);

								break;
							}
							updateSuccessfully = await movieDataLibrary.updateOne(
								{ title: movieTitleToUpdate },
								{ $set: { releaseYear: newReleaseYear } }
							);
							if (updateSuccessfully) {
								console.log(
									"\nRelease year updated successfully from " +
										movieTitleToUpdateExists.releaseYear +
										" to " +
										newReleaseYear +
										"!\n"
								);
							}
							break;
						case "genres":
							let newGenres = prompt(
								"Enter the new genres (comma-separated): "
							);
							if (newGenres.trim() === "") {
								console.log(
									"\nInvalid input! Genres cannot be empty.\nI'm sending you back to the main menu!\n"
								);

								break;
							}
							updateSuccessfully = await movieDataLibrary.updateOne(
								{ title: movieTitleToUpdate },
								{ $set: { genres: newGenres } }
							);
							if (updateSuccessfully) {
								console.log(
									"\nGenres updated successfully from " +
										movieTitleToUpdateExists.genres +
										" to " +
										newGenres +
										"!\n"
								);
							}
							break;
						case "rating":
							let newRatings = prompt(
								"Enter the (3) ratings (comma-separated): "
							)
								.trim()
								.split(",")
								.map(parseFloat);
							if (newRatings.length !== 3 || newRatings.some(isNaN)) {
								console.log(
									"\nInvalid input! Please enter 3 ratings separated by commas. See example inte the movie listed above and try again\nI'm sending you back to the main menu!\n"
								);

								break;
							}
							updateSuccessfully = await movieDataLibrary.updateOne(
								{ title: movieTitleToUpdate },
								{ $set: { ratings: newRatings } }
							);
							if (updateSuccessfully) {
								console.log(
									"\nRatings updated successfully from " +
										movieTitleToUpdateExists.ratings +
										" to " +
										newRatings +
										"!\n"
								);
							}
							break;
						case "cast":
							let newCast = prompt("Enter the new cast (comma-separated): ")
								.trim()
								.split(",");
							if (newCast.length === 0 || newCast[0].trim() === "") {
								console.log(
									"\nInvalid input! Cast cannot be empty.\nI'm sending you back to the main menu!\n"
								);

								break;
							}
							updateSuccessfully = await movieDataLibrary.updateOne(
								{ title: movieTitleToUpdate },
								{ $set: { cast: newCast } }
							);
							if (updateSuccessfully) {
								console.log(
									"\nCast updated successfully from " +
										movieTitleToUpdateExists.cast.join(", ") +
										" to " +
										newCast.join(", ") +
										"!\n"
								);
							}
							break;
						default:
							console.log(
								"\nInvalid input! Please enter a valid option. See example inte the movie listed above and try again \n"
							);
							break;
					}
				} else {
					console.log(
						"\nMovie with the title " +
							movieTitleToUpdate +
							" does not exist in the database.\nThe following movies are available in the database: \n"
					);
					await allMovies.then((movies) => {
						movies.map((movie) => {
							console.log(movie.title);
						});
					});
					console.log();
				}
				break;

			case "4":
				console.log();
				const movieTitleToDelete = prompt(
					"Enter the title of the movie you want to delete (case sensitive): "
				);

				let movieToDeleteExists = await movieDataLibrary.findOne({
					title: movieTitleToDelete,
				});

				if (!movieToDeleteExists) {
					console.log(
						"\nMovie with the title " +
							movieTitleToDelete +
							" does not exist in the database.\nThe following movies are available in the database: \n"
					);
					await allMovies.then((movies) => {
						movies.map((movie) => {
							console.log(movie.title);
						});
					});
					console.log();
				} else {
					let deleteSuccess = await movieDataLibrary.deleteOne({
						title: movieTitleToDelete,
					});
					deleteSuccess &&
						console.log(movieTitleToDelete + " deleted successfully!\n");
				}

				break;
			case "5":
				console.log("Goodbye!");
				break;

			default:
				break;
		}
	}
}
AssignmentApp();
