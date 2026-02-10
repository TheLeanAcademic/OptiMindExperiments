let allData = [];
let filteredData = [];

// Parse CSV data
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index].trim();
            });
            data.push(row);
        }
    }
    
    return data;
}

// Parse a single CSV line handling quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

// Load and display data
async function loadData() {
    try {
        // Fetch directly from main branch using raw GitHub URL
        const response = await fetch('https://raw.githubusercontent.com/TheLeanAcademic/OptiMindExperiments/main/optimind/data/optimind_cleaned_classified_industryor.csv');
        const text = await response.text();
        allData = parseCSV(text);
        filteredData = [...allData];
        
        populateClassFilter();
        updateStats();
        displayData();
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('dataTable').style.display = 'table';
    } catch (error) {
        document.getElementById('loading').textContent = 'Error loading data: ' + error.message;
        console.error('Error loading data:', error);
    }
}

// Populate the class filter dropdown
function populateClassFilter() {
    const classes = new Set();
    allData.forEach(row => {
        const problemClass = row.problem_class || '';
        // Extract individual classes from the array-like string
        const matches = problemClass.match(/'([^']+)'/g);
        if (matches) {
            matches.forEach(match => {
                classes.add(match.replace(/'/g, ''));
            });
        }
    });
    
    const classFilter = document.getElementById('classFilter');
    const sortedClasses = Array.from(classes).sort();
    
    sortedClasses.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        classFilter.appendChild(option);
    });
}

// Update statistics
function updateStats() {
    document.getElementById('totalProblems').textContent = allData.length;
    
    const classes = new Set();
    allData.forEach(row => {
        const problemClass = row.problem_class || '';
        const matches = problemClass.match(/'([^']+)'/g);
        if (matches) {
            matches.forEach(match => {
                classes.add(match.replace(/'/g, ''));
            });
        }
    });
    document.getElementById('uniqueClasses').textContent = classes.size;
    document.getElementById('visibleProblems').textContent = filteredData.length;
}

// Display data in table
function displayData() {
    const tbody = document.getElementById('tableBody');
    const noData = document.getElementById('noData');
    const table = document.getElementById('dataTable');
    
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        table.style.display = 'none';
        noData.style.display = 'block';
        return;
    }
    
    table.style.display = 'table';
    noData.style.display = 'none';
    
    filteredData.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        // Index
        const tdIndex = document.createElement('td');
        tdIndex.textContent = index + 1;
        tr.appendChild(tdIndex);
        
        // Problem Class
        const tdClass = document.createElement('td');
        tdClass.innerHTML = `<div class='problem-class'>${row.problem_class || 'N/A'}</div>`;
        tr.appendChild(tdClass);
        
        // Question
        const tdQuestion = document.createElement('td');
        const questionText = row.question || 'N/A';
        tdQuestion.innerHTML = `<div class='question-text'>${questionText.substring(0, 300)}${questionText.length > 300 ? '...' : ''}</div>`;
        tr.appendChild(tdQuestion);
        
        // Answer
        const tdAnswer = document.createElement('td');
        tdAnswer.innerHTML = `<div class='answer'>${row.answer || 'N/A'}</div>`;
        tr.appendChild(tdAnswer);
        
        tbody.appendChild(tr);
    });
}

// Filter data
function filterData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const classFilter = document.getElementById('classFilter').value;
    
    filteredData = allData.filter(row => {
        const matchesSearch = !searchTerm || 
            (row.question && row.question.toLowerCase().includes(searchTerm)) ||
            (row.answer && row.answer.toLowerCase().includes(searchTerm)) ||
            (row.problem_class && row.problem_class.toLowerCase().includes(searchTerm));
        
        const matchesClass = !classFilter || 
            (row.problem_class && row.problem_class.includes(classFilter));
        
        return matchesSearch && matchesClass;
    });
    
    updateStats();
    displayData();
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', filterData);
document.getElementById('classFilter').addEventListener('change', filterData);

// Load data on page load
loadData();