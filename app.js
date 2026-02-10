// Updated fetch URL for optimind_cleaned_classified_industryor.csv
fetch('https://raw.githubusercontent.com/TheLeanAcademic/OptiMindExperiments/main/optimind/data/optimind_cleaned_classified_industryor.csv')
    .then(response => response.json())
    .then(data => {
        // handle your data
    })
    .catch(error => console.error('Error fetching data:', error));