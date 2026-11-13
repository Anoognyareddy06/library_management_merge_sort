let books = [
    { id: 104, title: "Clean Code", author: "Robert C. Martin", year: 2008 },
    { id: 101, title: "Introduction to Algorithms", author: "Thomas H. Cormen", year: 2009 },
    { id: 105, title: "The Pragmatic Programmer", author: "Andrew Hunt", year: 1999 },
    { id: 102, title: "Design Patterns", author: "Erich Gamma", year: 1994 },
    { id: 103, title: "Artificial Intelligence", author: "Stuart Russell", year: 2020 }
];

let sortSteps = [];

function merge(left, right, key) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        let leftVal = left[i][key];
        let rightVal = right[j][key];

        if (typeof leftVal === "string") {
            leftVal = leftVal.toLowerCase();
            rightVal = rightVal.toLowerCase();
        }

        if (leftVal <= rightVal) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    while (i < left.length) {
        result.push(left[i]);
        i++;
    }

    while (j < right.length) {
        result.push(right[j]);
        j++;
    }

    let leftLabels = [];
    for (let x = 0; x < left.length; x++) {
        leftLabels.push(left[x][key]);
    }
    let rightLabels = [];
    for (let y = 0; y < right.length; y++) {
        rightLabels.push(right[y][key]);
    }
    sortSteps.push("Merged [" + leftLabels.join(", ") + "] and [" + rightLabels.join(", ") + "]");

    return result;
}

function mergeSort(arr, key) {
    if (arr.length <= 1) {
        return arr;
    }

    let mid = Math.floor(arr.length / 2);
    let left = [];
    let right = [];

    for (let i = 0; i < mid; i++) {
        left.push(arr[i]);
    }
    for (let j = mid; j < arr.length; j++) {
        right.push(arr[j]);
    }

    let sortedLeft = mergeSort(left, key);
    let sortedRight = mergeSort(right, key);

    return merge(sortedLeft, sortedRight, key);
}

function renderBooks(bookList) {
    let tbody = document.getElementById("bookTableBody");
    tbody.innerHTML = "";

    for (let i = 0; i < bookList.length; i++) {
        let row = document.createElement("tr");

        row.innerHTML =
            "<td><strong>" + bookList[i].id + "</strong></td>" +
            "<td>" + bookList[i].title + "</td>" +
            "<td>" + bookList[i].author + "</td>" +
            "<td>" + bookList[i].year + "</td>" +
            "<td><button class='btn btn-delete' onclick='deleteBook(" + bookList[i].id + ")'>Delete</button></td>";

        tbody.appendChild(row);
    }
}

function handleSort(key) {
    sortSteps = [];
    books = mergeSort(books, key);

    let headers = ["th-id", "th-title", "th-author", "th-year"];
    for (let i = 0; i < headers.length; i++) {
        document.getElementById(headers[i]).classList.remove("active-col");
    }
    document.getElementById("th-" + key).classList.add("active-col");

    let traceBox = document.getElementById("traceBox");
    traceBox.innerHTML = sortSteps.join("<br>");

    applySearchFilter();
}

function deleteBook(id) {
    let updatedBooks = [];
    for (let i = 0; i < books.length; i++) {
        if (books[i].id !== id) {
            updatedBooks.push(books[i]);
        }
    }
    books = updatedBooks;
    applySearchFilter();
}

function applySearchFilter() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let filtered = [];

    for (let i = 0; i < books.length; i++) {
        let titleMatch = books[i].title.toLowerCase().indexOf(query) !== -1;
        let authorMatch = books[i].author.toLowerCase().indexOf(query) !== -1;

        if (titleMatch || authorMatch) {
            filtered.push(books[i]);
        }
    }
    renderBooks(filtered);
}

document.getElementById("bookForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let id = parseInt(document.getElementById("bookId").value);
    let title = document.getElementById("bookTitle").value.trim();
    let author = document.getElementById("bookAuthor").value.trim();
    let year = parseInt(document.getElementById("bookYear").value);
    let errorMsg = document.getElementById("errorMsg");

    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) {
            errorMsg.textContent = "Error: Book ID " + id + " already exists!";
            return;
        }
    }

    errorMsg.textContent = "";
    books.push({ id: id, title: title, author: author, year: year });
    document.getElementById("bookForm").reset();
    applySearchFilter();
});

document.getElementById("searchInput").addEventListener("input", applySearchFilter);

renderBooks(books);
