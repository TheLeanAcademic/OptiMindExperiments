// Global variables
let allData = [];
let filteredData = [];

// CSV URL from GitHub
const CSV_URL = 'https://raw.githubusercontent.com/TheLeanAcademic/OptiMindExperiments/main/optimind/data/optimind_cleaned_classified_industryor.csv';

/**
 * Parses CSV text and handles complex quoted fields.
 * @param {string} csvText - The CSV text content.
 * @returns {Array} Parsed CSV data as array of objects.
 */
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const headers = parseCSVLine(lines[0]);
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            data.push(row);
        } else if (values.length > 1) {
            // Log warning for rows with mismatched column counts
            console.warn(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`);
        }
    }
    
    return data;
}

/**
 * Parses a single CSV line, handling quoted fields properly.
 * @param {string} line - A single line from the CSV.
 * @returns {Array} Array of field values.
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++;
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Field separator
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add the last field
    result.push(current.trim());
    
    return result;
}

/**
 * Fetches and loads CSV data from the GitHub URL.
 */
async function loadData() {
    const loadingEl = document.getElementById('loading');
    const tableEl = document.getElementById('dataTable');
    const noDataEl = document.getElementById('noData');
    
    try {
        loadingEl.textContent = 'Loading data...';
        loadingEl.style.display = 'block';
        tableEl.style.display = 'none';
        noDataEl.style.display = 'none';
        
        const response = await fetch(CSV_URL);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}. Please check your network connection and verify the CSV file exists.`);
        }
        
        const csvText = await response.text();
        allData = parseCSV(csvText);
        filteredData = [...allData];
        
        if (allData.length === 0) {
            throw new Error('No data found in CSV file');
        }
        
        console.log(`Loaded ${allData.length} records`);
        
        // Initialize UI
        populateClassFilter();
        updateStats();
        renderTable();
        setupEventListeners();
        
        // Hide loading, show table
        loadingEl.style.display = 'none';
        tableEl.style.display = 'table';
        
    } catch (error) {
        console.error('Error loading data:', error);
        loadingEl.innerHTML = `
            <div style="color: #dc3545;">
                <strong>Error loading data</strong><br>
                ${error.message}<br>
                <small>Please check the console for more details.</small>
            </div>
        `;
    }
}

/**
 * Populates the problem class filter dropdown.
 */
function populateClassFilter() {
    const classFilter = document.getElementById('classFilter');
    const classes = new Set();
    
    allData.forEach(row => {
        if (row.problem_class) {
            classes.add(row.problem_class);
        }
    });
    
    const sortedClasses = Array.from(classes).sort();
    
    // Clear existing options except "All Classes"
    classFilter.innerHTML = '<option value="">All Classes</option>';
    
    sortedClasses.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        classFilter.appendChild(option);
    });
}

/**
 * Updates the statistics display.
 */
function updateStats() {
    document.getElementById('totalProblems').textContent = allData.length;
    
    const uniqueClasses = new Set();
    allData.forEach(row => {
        if (row.problem_class) {
            uniqueClasses.add(row.problem_class);
        }
    });
    document.getElementById('uniqueClasses').textContent = uniqueClasses.size;
    
    document.getElementById('visibleProblems').textContent = filteredData.length;
}

/**
 * Renders the data table.
 */
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const noDataEl = document.getElementById('noData');
    const tableEl = document.getElementById('dataTable');
    
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tableEl.style.display = 'none';
        noDataEl.style.display = 'block';
        return;
    }
    
    tableEl.style.display = 'table';
    noDataEl.style.display = 'none';
    
    filteredData.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        // Index column
        const tdIndex = document.createElement('td');
        tdIndex.textContent = index + 1;
        tr.appendChild(tdIndex);
        
        // Problem class column
        const tdClass = document.createElement('td');
        tdClass.textContent = row.problem_class || 'N/A';
        tr.appendChild(tdClass);
        
        // Question column
        const tdQuestion = document.createElement('td');
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-text';
        questionDiv.textContent = row.question || 'N/A';
        tdQuestion.appendChild(questionDiv);
        tr.appendChild(tdQuestion);
        
        // Answer column
        const tdAnswer = document.createElement('td');
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        answerDiv.textContent = row.answer || 'N/A';
        tdAnswer.appendChild(answerDiv);
        tr.appendChild(tdAnswer);
        
        tbody.appendChild(tr);
    });
    
    // Update visible count
    document.getElementById('visibleProblems').textContent = filteredData.length;
}

/**
 * Filters data based on search and class filter.
 */
function filterData() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const selectedClass = document.getElementById('classFilter').value;
    
    filteredData = allData.filter(row => {
        // Check class filter
        if (selectedClass && row.problem_class !== selectedClass) {
            return false;
        }
        
        // Check search text
        if (searchText) {
            const questionMatch = (row.question || '').toLowerCase().includes(searchText);
            const answerMatch = (row.answer || '').toLowerCase().includes(searchText);
            const classMatch = (row.problem_class || '').toLowerCase().includes(searchText);
            
            if (!questionMatch && !answerMatch && !classMatch) {
                return false;
            }
        }
        
        return true;
    });
    
    renderTable();
}

/**
 * Sets up event listeners for search and filter controls.
 */
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const classFilter = document.getElementById('classFilter');
    
    searchInput.addEventListener('input', filterData);
    classFilter.addEventListener('change', filterData);
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadData);