const reposContainer = document.getElementById('repos-container');
const searchInput = document.getElementById('search-input');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

let currentPage = 1;
const reposPerPage = 10;
let lastSearchTerm = '';
let lastSearchResults = [];
let lastTotalCount = 0;

// Debounce function to delay API requests
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedFetchRepos = debounce(fetchRepos, 500);

async function fetchRepos() {
    try {
        const searchTerm = searchInput.value.trim();
        if (searchTerm === lastSearchTerm && currentPage === 1) {
            console.log('Using cached results for search term:', searchTerm); // Debug statement
            displayRepos(lastSearchResults);
            updatePagination(lastTotalCount);
            return;
        }
        
        reposContainer.innerHTML = '<p class="text-gray-600 text-center">Loading repositories...</p>';
        
        const query = searchTerm ? `${searchTerm}` : 'artificial-intelligence';
        
        console.log('Fetching repositories with query:', query); // Debug statement
        
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&per_page=${reposPerPage}&page=${currentPage}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 403 && errorData.message.includes('API rate limit exceeded')) {
                reposContainer.innerHTML = '<p class="text-red-500 text-center">API rate limit exceeded. Please try again later.</p>';
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return;
        }
        
        const data = await response.json();
        
        console.log('GitHub API Response:', data); // Debug statement

        if (data.items && data.items.length > 0) {
            lastSearchTerm = searchTerm;
            lastSearchResults = data.items;
            lastTotalCount = data.total_count;
            displayRepos(data.items);
        } else {
            reposContainer.innerHTML = '<p class="text-gray-600 text-center">No repositories found matching your criteria.</p>';
        }

        updatePagination(data.total_count);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        reposContainer.innerHTML = '<p class="text-red-500 text-center">Error fetching repositories. Please try again later.</p>';
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
        `;
        reposContainer.appendChild(repoCard);
    });
}

function updatePagination(totalCount) {
    const totalPages = Math.ceil(totalCount / reposPerPage);
    console.log('Total Results:', totalCount); // Debug statement
    console.log('Total Pages:', totalPages); // Debug statement

    if (isNaN(totalPages)) {
        pageInfo.textContent = 'Page NaN';
    } else {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

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

searchInput.addEventListener('input', () => {
    currentPage = 1;
    debouncedFetchRepos();
});

// Fetch repositories when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event triggered. Fetching repositories...'); // Debug statement
    fetchRepos();
});
