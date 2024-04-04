const PUBLICATIONS_PER_PAGE = 25;
let publicationsData = [];
let currentPage = 1;
let currentInfoBoxContent = "";

// Fetches data and initializes the application
window.onload = function () {
  fetchDataAndInitialize();
  setupModal();
};

// Fetches data and initializes the application
function fetchDataAndInitialize() {
  fetch("https://cdn.statically.io/gh/AKSW/aksw.bib/main/aksw.bib")
    .then(handleFetchResponse)
    .then(parseBibtexData)
    .then(initializeData)
    .then(addEventListeners)
    .catch(handleFetchError);
}

function handleFetchError(error) {
  console.error("There has been a problem with your fetch operation:", error);
  // Display an error message to the user or take appropriate action
}

function handleFetchResponse(response) {
  if (!response.ok) {
    throw new Error("HTTP error " + response.status);
  }
  return response.text();
}

// Initializes data and updates the DOM
function initializeData(data) {
  publicationsData = data;
  generateCheckboxesForYears();
  generateCheckboxesForAuthors();
  updateDOM();
}

function parseBibtexData(bibtexString) {
  try {
    const entries = bibtexString.split('@');
    const parsedEntries = [];

    for (let i = 1; i < entries.length; i++) {
      const entry = entries[i].trim();
      if (entry) {
        const [entryType, entryContent] = entry.split(/\{(.*)/s);
        const [entryKey, ...entryFields] = entryContent.split(/,\s*(?![^{}]*\})/);

        const fields = {};
        let currentField = '';
        let key = '';

        for (let j = 0; j < entryFields.length; j++) {
          const line = entryFields[j].trim();

          if (line.endsWith('},') || line.endsWith('}')) {
            currentField += line.slice(0, -1).trim();
            if (key) {
              fields[key.trim().toLowerCase()] = currentField.trim().replace(/[{}]/g, '');
            }
            currentField = '';
            key = '';
          } else if (line.includes('=')) {
            if (key) {
              fields[key.trim().toLowerCase()] = currentField.trim().replace(/[{}]/g, '');
            }
            [key, currentField] = line.split(/\s*=\s*/);
          } else {
            currentField += line + ',';
          }
        }

        if (key) {
          fields[key.trim().toLowerCase()] = currentField.trim().replace(/[{}]/g, '');
        }

        const parsedEntry = {
          entryType: entryType.trim().toLowerCase(),
          entryKey: entryKey.trim(),
          fields: fields,
        };

        // Log the parsed entry for debugging
        console.log("Parsed Entry:");
        console.log("Entry Type:", parsedEntry.entryType);
        console.log("Entry Key:", parsedEntry.entryKey);
        console.log("Fields:");
        for (let key in parsedEntry.fields) {
          console.log(`  ${key}: ${parsedEntry.fields[key]}`);
        }
        console.log("---");

        parsedEntries.push(parsedEntry);
      }
    }

    return parsedEntries;
  } catch (error) {
    console.error("Error parsing BibTeX data:", error);
    throw error;
  }
}

// Generates checkboxes for each year
function generateCheckboxesForYears() {
  let years = getUniqueYears();
  let yearFilter = document.getElementById("yearFilter");
  years.forEach((year) => {
    let checkbox = appendCheckbox(yearFilter, "year", year);
    checkbox.addEventListener("change", function () {
      currentPage = 1;
      updateDOM();
    });
  });
}

// Gets unique years from publicationsData
function getUniqueYears() {
  let years = Array.from(new Set(publicationsData.map((item) => item.fields.year)));
  years.sort((a, b) => b - a); // Sort years in descending order
  return years;
}

// Generates checkboxes for each author
function generateCheckboxesForAuthors() {
  let authors = getUniqueAuthors();
  let authorFilter = document.getElementById("authorFilter");
  authors.forEach((author) => {
    let checkbox = appendCheckbox(authorFilter, "author", author);
    checkbox.addEventListener("change", function () {
      currentPage = 1;
      updateDOM();
    });
  });
}

// Gets unique authors from publicationsData
function getUniqueAuthors() {
  let authors = Array.from(
    new Set(
      publicationsData.flatMap((item) =>
        item.fields.author ? item.fields.author.split(' and ').map(author => author.trim()) : []
      )
    )
  );
  authors.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return authors;
}

// Appends a checkbox to a filter
function appendCheckbox(filter, prefix, value) {
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = prefix + value;
  checkbox.value = value;

  let label = document.createElement("label");
  label.htmlFor = prefix + value;
  label.appendChild(document.createTextNode(value));

  filter.appendChild(checkbox);
  filter.appendChild(label);
  filter.appendChild(document.createElement("br"));

  return checkbox; // Return the checkbox
}

// Handles fetch errors
function handleFetchError(error) {
  console.error("There has been a problem with your fetch operation:", error);
}

// Adds event listeners
function addEventListeners() {
  document.getElementById("textFilter").addEventListener("input", function (e) {
    currentPage = 1;
    updateDOM();
  });

  document.getElementById("sort").addEventListener("change", function () {
    currentPage = 1;
    let arrow = document.getElementById("arrow");
    let sortLabel = document.getElementById("sortLabel"); // Get the label element
    if (this.checked) {
      arrow.textContent = "↑";
      sortLabel.innerHTML = '<span id="arrow">↑</span> Ascending'; // Set the label text to "Ascending" when checked
    } else {
      arrow.textContent = "↓";
      sortLabel.innerHTML = '<span id="arrow">↓</span> Descending'; // Set the label text to "Descending" when not checked
    }
    updateDOM();
  });
}

// Updates the sort order
function updateSortOrder() {
  let arrow = document.getElementById("arrow");
  let sortLabel = document.getElementById("sortLabel"); // Get the label element
  if (this.checked) {
    arrow.textContent = "↑";
    sortLabel.innerHTML = '<span id="arrow">↑</span> Ascending'; // Set the label text to "Ascending" when checked
  } else {
    arrow.textContent = "↓";
    sortLabel.innerHTML = '<span id="arrow">↓</span> Descending'; // Set the label text to "Descending" when not checked
  }
}

// Toggles the display of the year filter
window.toggleYearFilter = function() {
  toggleFilterDisplay("yearFilter");
}

// Toggles the display of the author filter
window.toggleAuthorFilter = function() {
  toggleFilterDisplay("authorFilter");
}

// Toggles the display of a filter
function toggleFilterDisplay(filterId) {
  var filter = document.getElementById(filterId);
  if (!filter.style.display || filter.style.display === "none") {
    filter.style.display = "block";
  } else {
    filter.style.display = "none";
  }
}

// Changes the current page and updates the DOM
function changePage(page) {
  currentPage = page;
  updateDOM();
}

// Sets up the modal for the info
function setupModal() {
  var modal = document.getElementById("userGuideModal");
  var btn = document.getElementById("openModal");
  var span = document.getElementById("closeModal");

  btn.onclick = function() {
    modal.style.display = "block";
  }

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

// Creates an info box with the given content
function createInfoBox(content) {
  console.log("Creating info box with content: ", content);
  let infoBox = document.createElement("div");
  infoBox.className = "info-box";
  infoBox.innerText = content;
  infoBox.style.position = "relative";

  return infoBox;
}

// Creates an info box with the given content and a copy button
function createInfoBoxWithButton(content) {
  let infoBox = createInfoBox(content);

  // Create a copy button
  let button = document.createElement("button");
  button.textContent = "Copy to clipboard";
  button.style.cssText =
    "position: absolute; top: 0; right: 0; font-size: 0.8em; border: none; background-color: #007BFF; color: white; padding: 5px 10px; border-radius: 5px; margin-top: 5px; margin-right: 5px;";
  button.addEventListener("click", function () {
    navigator.clipboard.writeText(content).then(
      function () {
        console.log("Copying to clipboard was successful!");
        button.style.backgroundColor = "#6c757d";
        button.textContent = "Copied to clipboard";
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  });

  // Append the button to the info box
  infoBox.appendChild(button);

  return infoBox;
}


// Toggles the display of an info box
function toggleInfoBox(publicationDiv, infoBox) {
  // Remove any existing info box
  let existingInfoBoxes = publicationDiv.querySelectorAll(".info-box");
  existingInfoBoxes.forEach((box) => publicationDiv.removeChild(box));

  // Check if the new info box content is the same as the current one
  if (currentInfoBoxContent === infoBox.innerText) {
    // If it is, clear currentInfoBoxContent so it won't be added again
    currentInfoBoxContent = "";
  } else {
    // If it's not, update currentInfoBoxContent and add the new info box
    currentInfoBoxContent = infoBox.innerText;
    publicationDiv.appendChild(infoBox);
  }
}

// Updates the DOM
function updateDOM() {
  let container = document.getElementById("publications");
  container.innerHTML = ""; // Clear the container

  let filteredPublications = filterPublicationsBySearchAndCheckboxes();

  // Determine sort order
  let sortOrder = document.getElementById("sort").checked ? "asc" : "desc";
  // Sort filtered publications
  filteredPublications.sort((a, b) => {
    return sortOrder === "asc" ? a.fields.year - b.fields.year : b.fields.year - a.fields.year;
  });

  let paginatedPublications = paginatePublications(filteredPublications);

  // Display filtered and sorted publications
  paginatedPublications.forEach((publication) => {
    displayPublication(container, publication);
  });

  displayPaginationButtons(container, filteredPublications.length);

  document.getElementById("counter").textContent =
    "Number of publications: " + filteredPublications.length;
}

// Filters publications by search and checkboxes
function filterPublicationsBySearchAndCheckboxes() {
  let textFilter = document.getElementById("textFilter").value.toLowerCase();
  let yearCheckboxes = document.querySelectorAll("#yearFilter input:checked");
  let authorCheckboxes = document.querySelectorAll(
    "#authorFilter input:checked"
  );

  return publicationsData.filter((publication) => {
    return (
      isPublicationInTextFilter(publication, textFilter) &&
      isPublicationInYearFilter(publication, yearCheckboxes) &&
      isPublicationInAuthorFilter(publication, authorCheckboxes)
    );
  });
}

// Checks if a publication is in the text filter
function isPublicationInTextFilter(publication, textFilter) {
  return (
    publication.entryKey.toLowerCase().includes(textFilter) ||
    (publication.fields.author &&
      publication.fields.author.toLowerCase().includes(textFilter))
  );
}

// Checks if a publication is in the year filter
function isPublicationInYearFilter(publication, yearCheckboxes) {
  return (
    yearCheckboxes.length === 0 ||
    Array.from(yearCheckboxes).some(
      (checkbox) => checkbox.value == publication.fields.year
    )
  );
}

// Checks if a publication is in the author filter
function isPublicationInAuthorFilter(publication, authorCheckboxes) {
  return (
    authorCheckboxes.length === 0 ||
    Array.from(authorCheckboxes).some(
      (checkbox) =>
        publication.fields.author &&
        publication.fields.author.split(' and ').map(author => author.trim()).includes(checkbox.value)
    )
  );
}

// Paginates publications
function paginatePublications(filteredPublications) {
  let start = (currentPage - 1) * PUBLICATIONS_PER_PAGE;
  let end = start + PUBLICATIONS_PER_PAGE;
  return filteredPublications.slice(start, end);
}

function displayPublication(container, publication) {
  let div = createPublicationDiv(publication);
  container.appendChild(div);
}

function createPublicationDiv(publication) {
  let div = document.createElement("div");
  div.className = "publication";

  appendPublicationTitle(div, publication);
  appendPublicationAuthors(div, publication);
  appendPublicationYear(div, publication);
  appendBibButton(div, publication);
  appendUrlButton(div, publication, "url", "PDF");
  appendAbstractButton(div, publication);

  return div;
}

// Appends the publication title to a div
function appendPublicationTitle(div, publication) {
  let title = document.createElement("h2");
  title.textContent = publication.fields.title || publication.entryKey;
  div.appendChild(title);
}

// Appends the publication authors to a div
function appendPublicationAuthors(div, publication) {
  let authors = document.createElement("p");
  authors.textContent = publication.fields.author || "Authors: N/A";
  div.appendChild(authors);
}

// Appends the publication year to a div
function appendPublicationYear(div, publication) {
  let year = document.createElement("p");
  year.textContent = publication.fields.year || "";
  div.appendChild(year);
}

// Appends a Bib button to a div
function appendBibButton(div, publication) {
  let infoButton = createButton("BIB");
  let indicator = createIndicator("bibIndicator" + publication.entryKey);

  infoButton.addEventListener("click", function () {
    let infoBox = createInfoBoxWithButton(getBibtexString(publication));
    toggleInfoBox(div, infoBox);
    indicator.textContent = indicator.textContent === "▼" ? "▲" : "▼";

    let otherIndicator = document.getElementById(
      "absIndicator" + publication.entryKey
    );
    if (otherIndicator) {
      otherIndicator.textContent = "▼";
    }
  });

  div.appendChild(infoButton);
  div.appendChild(indicator);
}

// Generates the BibTeX string for a publication
function getBibtexString(publication) {
  let bibtexString = "@" + publication.entryType + "{" + publication.entryKey;
  for (let key in publication.fields) {
    bibtexString += ",\n  " + key + " = {" + publication.fields[key] + "}";
  }
  bibtexString += "\n}";
  return bibtexString;
}

// Appends a URL button to a div
function appendUrlButton(div, publication, property, text) {
  if (publication.fields[property]) {
    let urlButton = createButton(text);
    urlButton.href = publication.fields[property];
    urlButton.target = "_blank";
    div.appendChild(urlButton);
  }
}
// Creates a button with the given text
function createButton(text) {
  let button = document.createElement("a");
  button.className = "url-button";
  button.textContent = text;
  return button;
}

// Appends an abstract button to a div
function appendAbstractButton(div, publication) {
  if (publication.fields.abstract) {
    let abstractButton = createButton("ABS");
    let indicator = createIndicator("absIndicator" + publication.entryKey); // Pass a unique id

    abstractButton.addEventListener("click", function () {
      let infoBox = createInfoBox(publication.fields.abstract);
      toggleInfoBox(div, infoBox);
      indicator.textContent = indicator.textContent === "▼" ? "▲" : "▼"; // Toggle the indicator

      // Reset the other button's indicator
      let otherIndicator = document.getElementById(
        "bibIndicator" + publication.entryKey
      );
      if (otherIndicator) {
        otherIndicator.textContent = "▼";
      }
    });

    div.appendChild(abstractButton);
    div.appendChild(indicator);
  }
}

// Creates an indicator
function createIndicator(id) {
  let indicator = document.createElement("span");
  indicator.textContent = "▼"; // Downward arrow to indicate expandability
  indicator.className = "indicator";
  indicator.id = id; // Set the id
  return indicator;
}

// Displays pagination buttons
function displayPaginationButtons(container, totalPublications) {
  if (totalPublications > 0) {
    let totalPages = Math.ceil(totalPublications / PUBLICATIONS_PER_PAGE);

    // Create a div for pagination buttons
    let paginationDiv = document.createElement("div");
    paginationDiv.style.textAlign = "center"; // Center the buttons

    appendPageButton(paginationDiv, 1, currentPage > 2); // First page
    appendPageButton(paginationDiv, currentPage - 1, currentPage > 1); // Previous page
    appendCurrentPageButton(paginationDiv, currentPage); // Current page
    appendPageButton(paginationDiv, currentPage + 1, currentPage < totalPages); // Next page
    appendPageButton(paginationDiv, totalPages, currentPage < totalPages - 1); // Last page

    // Append the pagination div to the container
    container.appendChild(paginationDiv);
  }
}

// Appends a page button to a div
function appendPageButton(div, page, condition) {
  if (condition) {
    let pageButton = createPageButton(page);
    pageButton.addEventListener("click", function () {
      changePage(page);
      window.scrollTo(0, document.body.scrollHeight);
    });
    div.appendChild(pageButton);
  }
}

// Creates a page button
function createPageButton(page) {
  let pageButton = document.createElement("button");
  pageButton.textContent = page;
  pageButton.className = "btn btn-secondary mr-2 page-button"; // Added 'pagination-button' class
  return pageButton;
}

// Appends the current page button to a div
function appendCurrentPageButton(div, page) {
  let currentPageButton = document.createElement("button");
  currentPageButton.textContent = page;
  currentPageButton.className = "btn btn-primary mr-2 page-button current-page-button"; // Added 'pagination-button' and 'current-page-button' classes
  div.appendChild(currentPageButton);
}
