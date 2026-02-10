# OptiMind Data Explorer

A simple web application to explore the Operations Research problems dataset.

## Features

- 📊 **Interactive Data Table**: Browse through all problems in the dataset
- 🔍 **Search Functionality**: Search through questions and answers
- 🏷️ **Filter by Class**: Filter problems by their classification
- 📈 **Statistics Dashboard**: View key metrics about the dataset
- 🎨 **Modern UI**: Clean, responsive design

## How to Use

### Option 1: GitHub Pages (Recommended)

1. Go to your repository settings
2. Navigate to "Pages" section
3. Under "Source", select the `data_explorer_app` branch
4. Select `/` (root) as the folder
5. Click "Save"
6. Your app will be available at: `https://theleanacademic.github.io/OptiMindExperiments/`

### Option 2: Local Development

1. Clone the repository and checkout the branch:
   ```bash
   git clone https://github.com/TheLeanAcademic/OptiMindExperiments.git
   cd OptiMindExperiments
   git checkout data_explorer_app
   ```

2. Start a local web server. You can use Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

3. Open your browser and navigate to `http://localhost:8000`

## Files

- `index.html` - Main HTML structure
- `app.js` - JavaScript functionality for data loading and filtering
- `README.md` - This file

## Data Source

The app loads data from:
`optimind/data/optimind_cleaned_classified_industryor.csv`

## Features Breakdown

### Search
Type any text in the search box to filter problems by:
- Question content
- Answer values
- Problem classifications

### Filter by Class
Use the dropdown to filter by specific problem types such as:
- Production Planning Problem
- Knapsack
- Transportation Problem
- And many more...

### Statistics
View real-time statistics:
- Total number of problems
- Number of unique problem classes
- Number of currently visible problems (after filtering)

## Browser Compatibility

This app works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Future Enhancements

Potential features for future versions:
- Export filtered data to CSV
- Advanced filtering (by answer range, multiple classes)
- Detailed problem view with full text
- Data visualization charts
- Sort by column