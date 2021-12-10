const fs = require('fs')

// Option to provide a custom file path, defaults to books.json in the root
const fileName = process.argv[2] || './books.json'

// Create the DB if it doesn't exist yet
const initialize = () => {
	if (!fileName.endsWith('.json')) {
		throw new Error('Please provide a valid JSON fileName')
	}

	const data = {
		books: [],
	}

	if (!fs.existsSync(fileName)) {
		fs.writeFileSync(fileName, JSON.stringify(data, null, 4), (err) => {
			if (err) throw err
		})
	}
}

// Read all entries and sort them by author
const getEntries = () => {
	const data = fs.readFileSync(fileName)
	const parsed = JSON.parse(data)
	const db = parsed.books

	// Sort on author name alphabetically, ascending
	// I decided to sort only on read, so its more future proof.
	db.sort((a, b) => a.author.localeCompare(b.author))

	return parsed.books
}

// Add a new entry to the database
const addEntry = ({ title, author, ISBN }) => {
	write((currentState) => [
		...currentState,
		{
			id: String(currentState.length + 1),
			title,
			author,
			ISBN,
		},
	])
}

// Delete an entry from the database
const deleteEntry = (id) => {
	write((currentState) => currentState.filter((book) => book.id !== id))
}

module.exports = {
	initialize,
	getEntries,
	deleteEntry,
	addEntry,
	fileName,
}

/**
 * Helper function to easily write to the database by just providing a new state.
 * Takes an updateFunc, which receives the currentState of the database, and should return the new state.
 */
const write = (updateFunc) => {
	const newState = updateFunc(getEntries())

	try {
		fs.writeFileSync(fileName, JSON.stringify({ books: newState }, null, 4))
	} catch (e) {
		console.error(`Could not write to ${fileName}: ${e.message}`)
	}
}
