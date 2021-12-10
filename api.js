const readline = require('readline')
const db = require('./db')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

const initialize = () => {
	db.initialize()
}

const welcome = () => {
	console.log('**********************************')
	console.log('Welcome to Library Keeper 3000')
	console.log('Please, pick an option to continue')
	console.log('**********************************')
}

const start = () => {
	console.log('\n')
	console.log('1) Add New Book - 2) Show All Books - 3) Delete a Book - Q) Exit The Program')
	console.log('\n')

	rl.question('Option: ', (answer) => {
		switch (answer) {
			case '1':
				addNewBook()
				break
			case '2':
				showAllBooks()
				break
			case '3':
				deleteBook()
				break
			case 'Q':
			case 'q':
				rl.close()
				break
			default:
				console.log('Invalid option, please use one of the valid options')
				start()
				break
		}
	})
}

// Add a new book to the database
const addNewBook = () => {
	rl.question('Title of the book:', (title) => {
		rl.question('Author of the book:', (author) => {
			rl.question('Book ISBN:', (ISBN) => {
				console.log('About to add book with the following contents:')
				console.log(`Author: ${author} - Title: ${title} - ISBN: ${ISBN}`)

				rl.question('Is this correct? (Y/N):', (answer) => {
					if (answer === 'Y' || answer === 'y') {
						db.addEntry({ title, author, ISBN })
						console.log('Book added successfully')
					} else {
						console.log('Cancelled operation')
					}

					start()
				})
			})
		})
	})
}

// Reads the database, and prints each line to the console
const showAllBooks = () => {
	db.getEntries().forEach((line) => {
		console.log(
			`id: ${line.id} - Author: ${line.author} - Title: ${line.title} - ISBN: ${line.ISBN}`
		)
	})

	start()
}

// Delete a book with a given ID
const deleteBook = () => {
	rl.question('ID of the book to delete:', (id) => {
		db.deleteEntry(id)
		console.log('Book deleted successfully')
		start()
	})
}

module.exports = {
	initialize,
	welcome,
	start,
	addNewBook,
	showAllBooks,
}
