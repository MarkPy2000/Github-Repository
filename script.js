const reposContainer = document.getElementById('repos-container');
const searchInput = document.getElementById('search-input');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

let currentPage = 1;
const reposPerPage = 10;

async function fetchRepos() {
    try {
        reposContainer.innerHTML = '<p class="text-gray-600 text-center">Loading repositories...</p>';
        
        const searchTerm = searchInput.value.trim();
        const query = searchTerm ? `${searchTerm}+topic:artificial-intelligence` : 'topic:artificial-intelligence';
        
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&per_page=${reposPerPage}&page=${currentPage}`);
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

searchInput.addEventListener('input', () => {
    currentPage = 1;
    fetchRepos();
});

fetchRepos();