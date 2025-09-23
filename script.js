// script.js
document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const extractBtn = document.getElementById('extractBtn');
    const clearBtn = document.getElementById('clearBtn');
    const viewStoredBtn = document.getElementById('viewStoredBtn');
    const resultsDiv = document.getElementById('results');
    const storedDataDiv = document.getElementById('storedData');

    // API base URL (assuming server runs on localhost:3000)
    const API_BASE = 'http://localhost:3000';

    // Regex patterns for each data type
    const patterns = {
        emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        urls: /https?:\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[a-zA-Z0-9._~:\/?#[\]@!$&'()+,;=-])?/g,
        phones: /\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})/g,
        creditCards: /(?:\d{4}[ -]?){3}\d{4}/g,
        times: /(?:[01]?\d|2[0-3]):\d{2}|(?:1[0-2]|0?[1-9]):\d{2} ?[AP]M/g,
        htmlTags: /<[a-zA-Z]+(?:\s+[a-zA-Z-]+(?:="[^"]")?)\s*\/?>/g,
        hashtags: /#[a-zA-Z]+(?:[a-zA-Z0-9_])*/g,
        currencies: /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g
    };

    // Labels for display
    const labels = {
        emails: 'Email Addresses',
        urls: 'URLs',
        phones: 'Phone Numbers',
        creditCards: 'Credit Card Numbers',
        times: 'Times',
        htmlTags: 'HTML Tags',
        hashtags: 'Hashtags',
        currencies: 'Currency Amounts'
    };

    let currentExtractions = {}; // To hold current matches for saving

    extractBtn.addEventListener('click', function() {
        const text = inputText.value;
        if (!text.trim()) {
            alert('Please enter some text to extract.');
            return;
        }

        resultsDiv.innerHTML = '';
        currentExtractions = {};

        Object.keys(patterns).forEach(type => {
            const regex = patterns[type];
            const matches = text.match(regex) || [];
            currentExtractions[type] = matches;
            
            const section = document.createElement('div');
            section.className = 'data-section';
            
            const title = document.createElement('h3');
            title.textContent = labels[type];
            section.appendChild(title);
            
            if (matches.length > 0) {
                const ul = document.createElement('ul');
                matches.forEach(match => {
                    const li = document.createElement('li');
                    li.textContent = match;
                    const saveBtn = document.createElement('button');
                    saveBtn.textContent = 'Save';
                    saveBtn.className = 'save-btn';
                    saveBtn.onclick = () => saveExtraction(type, match);
                    li.appendChild(saveBtn);
                    ul.appendChild(li);
                });
                section.appendChild(ul);
            } else {
                const p = document.createElement('p');
                p.textContent = 'No matches found.';
                p.className = 'no-matches';
                section.appendChild(p);
            }
            
            resultsDiv.appendChild(section);
        });

        // Add Save All button
        const saveAllBtn = document.createElement('button');
        saveAllBtn.id = 'saveAllBtn';
        saveAllBtn.textContent = 'Save All Extractions';
        saveAllBtn.onclick = saveAllExtractions;
        resultsDiv.appendChild(saveAllBtn);
    });

    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        resultsDiv.innerHTML = '';
        storedDataDiv.innerHTML = '';
        currentExtractions = {};
    });

    viewStoredBtn.addEventListener('click', loadStoredData);

    // CRUD Functions

    async function saveExtraction(type, value) {
        try {
            const response = await fetch(${API_BASE}/extractions, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, value })
            });
            if (response.ok) {
                alert('Extraction saved!');
                loadStoredData(); // Refresh stored data view
            } else {
                alert('Failed to save extraction.');
            }
        } catch (error) {
            console.error('Error saving extraction:', error);
            alert('Error saving extraction.');
        }
    }

    async function saveAllExtractions() {
        let savedCount = 0;
        for (const type in currentExtractions) {
            for (const value of currentExtractions[type]) {
                try {
                    const response = await fetch(${API_BASE}/extractions, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type, value })
                    });
                    if (response.ok) savedCount++;
                } catch (error) {
                    console.error('Error saving:', error);
                }
            }
        }
        alert(${savedCount} extractions saved!);
        loadStoredData();
    }

    async function loadStoredData() {
        try {
            const response = await fetch(${API_BASE}/extractions);
            if (response.ok) {
                const data = await response.json();
                displayStoredData(data);
            } else {
                alert('Failed to load stored data.');
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
            alert('Error loading stored data.');
        }
    }

    function displayStoredData(data) {
        storedDataDiv.innerHTML = '';
        const section = document.createElement('div');
        section.className = 'stored-section';
        
        const title = document.createElement('h3');
        title.textContent = 'Stored Extractions';
        section.appendChild(title);
        
        if (data.length > 0) {
            const ul = document.createElement('ul');
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = ${item.type}: ${item.value};
                li.dataset.id = item.id;
                
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.className = 'edit-btn';
                editBtn.onclick = () => editExtraction(item.id, item.value);
                li.appendChild(editBtn);
                
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete-item-btn';
                deleteBtn.onclick = () => deleteExtraction(item.id);
                li.appendChild(deleteBtn);
                
                ul.appendChild(li);
            });
            section.appendChild(ul);
        } else {
            const p = document.createElement('p');
            p.textContent = 'No stored data.';
            p.className = 'no-matches';
            section.appendChild(p);
        }
        
        storedDataDiv.appendChild(section);
    }

    function editExtraction(id, currentValue) {
        const newValue = prompt('Edit value:', currentValue);
        if (newValue !== null && newValue !== currentValue) {
            updateExtraction(id, newValue);
        }
    }

    async function updateExtraction(id, newValue) {
        try {
            const response = await fetch(${API_BASE}/extractions/${id}, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: newValue })
            });
            if (response.ok) {
                alert('Extraction updated!');
                loadStoredData();
            } else {
                alert('Failed to update extraction.');
            }
        } catch (error) {
            console.error('Error updating extraction:', error);
            alert('Error updating extraction.');
        }
    }

    async function deleteExtraction(id) {
        if (confirm('Are you sure you want to delete this extraction?')) {
            try {
                const response = await fetch(${API_BASE}/extractions/${id}, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Extraction deleted!');
                    loadStoredData();
                } else {
                    alert('Failed to delete extraction.');
                }
            } catch (error) {
                console.error('Error deleting extraction:', error);
                alert('Error deleting extraction.');
            }
        }
    }
});