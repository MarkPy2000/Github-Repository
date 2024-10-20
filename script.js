const reposContainer = document.getElementById('repos-container');
const searchInput = document.getElementById('search-input');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const savedReposContainer = document.getElementById('saved-repos-container');
const sidebar = document.getElementById('sidebar');
const closeSidebarButton = document.getElementById('close-sidebar');
const searchSavedReposInput = document.getElementById('search-saved-repos');
const downloadSavedReposButton = document.getElementById('download-saved-repos');
const fabToggleSidebarButton = document.getElementById('fab-toggle-sidebar');

let currentPage = 1;
const reposPerPage = 10;
let isLoading = false;

async function fetchRepos() {
    if (isLoading) return;
    isLoading = true;
    reposContainer.innerHTML = '<p class="text-gray-600 text-center">Loading repositories...</p>';

    try {
        const searchTerm = searchInput.value.trim();
        const query = searchTerm ? `${searchTerm}` : 'artificial-intelligence';

        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&per_page=${reposPerPage}&page=${currentPage}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            displayRepos(data.items);
        } else {
            reposContainer.innerHTML = '<p class="text-gray-600 text-center">No repositories found matching your criteria.</p>';
        }

        updatePagination(data.total_count);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        reposContainer.innerHTML = '<p class="text-red-500 text-center">Error fetching repositories. Please try again later.</p>';
    } finally {
        isLoading = false;
    }
}

function displayRepos(repos) {
    reposContainer.innerHTML = '';
    repos.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card', 'mb-4', 'p-4', 'bg-gray-50', 'rounded-lg', 'shadow');
        repoCard.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${repo.full_name}</a>
            </h3>
            <p class="text-gray-700 mb-2">${repo.description || 'No description available.'}</p>
            <div class="flex items-center text-sm text-gray-600">
                <span class="mr-4">⭐ ${repo.stargazers_count} stars</span>
                <span>🍴 ${repo.forks_count} forks</span>
            </div>
            <button class="save-repo-btn bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4">Save</button>
        `;
        reposContainer.appendChild(repoCard);

        // Add event listener to the "Save" button
        const saveButton = repoCard.querySelector('.save-repo-btn');
        saveButton.addEventListener('click', () => saveRepo(repo));
    });
}

function saveRepo(repo) {
    let savedRepos = JSON.parse(localStorage.getItem('savedRepos')) || [];
    const isRepoSaved = savedRepos.some(savedRepo => savedRepo.id === repo.id);

    if (!isRepoSaved) {
        savedRepos.push(repo);
        localStorage.setItem('savedRepos', JSON.stringify(savedRepos));
        alert(`Repository "${repo.full_name}" has been saved!`);
        displaySavedRepos(); // Update the saved repositories section
    } else {
        alert(`Repository "${repo.full_name}" is already saved.`);
    }
}

function displaySavedRepos() {
    savedReposContainer.innerHTML = '';

    const savedRepos = JSON.parse(localStorage.getItem('savedRepos')) || [];
    const searchTerm = searchSavedReposInput.value.trim().toLowerCase();

    const filteredRepos = savedRepos.filter(repo => 
        repo.full_name.toLowerCase().includes(searchTerm) || 
        repo.description.toLowerCase().includes(searchTerm)
    );

    if (filteredRepos.length === 0) {
        savedReposContainer.innerHTML = '<p class="text-gray-600 text-center">No saved repositories yet.</p>';
        return;
    }

    filteredRepos.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card', 'mb-4', 'p-4', 'bg-gray-50', 'rounded-lg', 'shadow');
        repoCard.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${repo.full_name}</a>
            </h3>
            <p class="text-gray-700 mb-2">${repo.description || 'No description available.'}</p>
            <div class="flex items-center text-sm text-gray-600">
                <span class="mr-4">⭐ ${repo.stargazers_count} stars</span>
                <span>🍴 ${repo.forks_count} forks</span>
            </div>
            <button class="remove-repo-btn bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-4">Remove</button>
        `;
        savedReposContainer.appendChild(repoCard);

        // Add event listener to the "Remove" button
        const removeButton = repoCard.querySelector('.remove-repo-btn');
        removeButton.addEventListener('click', () => removeRepo(repo));
    });
}

function removeRepo(repo) {
    let savedRepos = JSON.parse(localStorage.getItem('savedRepos')) || [];
    savedRepos = savedRepos.filter(savedRepo => savedRepo.id !== repo.id);
    localStorage.setItem('savedRepos', JSON.stringify(savedRepos));
    displaySavedRepos();
    alert(`Repository "${repo.full_name}" has been removed from saved repositories.`);
}

function updatePagination(totalCount) {
    const totalPages = Math.ceil(totalCount / reposPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchRepos();
    }
});

nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchRepos();
});

let debounceTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        currentPage = 1;
        fetchRepos();
    }, 300);
});

searchSavedReposInput.addEventListener('input', displaySavedRepos);

// Close sidebar
closeSidebarButton.addEventListener('click', () => {
    sidebar.classList.add('translate-x-full');
    fabToggleSidebarButton.classList.remove('hidden');
});

// Download saved repositories
downloadSavedReposButton.addEventListener('click', () => {
    const savedRepos = JSON.parse(localStorage.getItem('savedRepos')) || [];
    if (savedRepos.length === 0) {
        alert('No saved repositories to download.');
        return;
    }

    let textContent = '';
    savedRepos.forEach(repo => {
        textContent += `Name: ${repo.full_name}\n`;
        textContent += `Link: ${repo.html_url}\n`;
        textContent += `Description: ${repo.description || 'No description available.'}\n`;
        textContent += `Stars: ${repo.stargazers_count}\n`;
        textContent += `Forks: ${repo.forks_count}\n`;
        textContent += '----------------------------------------\n';
    });

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved_repositories.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Floating Action Button (FAB) to toggle sidebar
fabToggleSidebarButton.addEventListener('click', () => {
    sidebar.classList.toggle('translate-x-full');
    fabToggleSidebarButton.classList.toggle('hidden');
});

// Call displaySavedRepos when the page loads
window.addEventListener('load', displaySavedRepos);

fetchRepos();
