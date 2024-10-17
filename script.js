const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

let currentPage = 1;
const articlesPerPage = 10;
const apiKey = '58655e732f538bc99ef538224c7f06d4'; // Replace with your actual GNews API key

async function fetchNews() {
    try {
        newsContainer.innerHTML = '<p class="text-gray-600 text-center">Loading news articles...</p>';
        
        const searchTerm = searchInput.value.trim();
        const query = searchTerm ? `${searchTerm}+artificial-intelligence` : 'artificial-intelligence';
        
        console.log('Fetching news with query:', query); // Debug statement
        
        const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&max=${articlesPerPage}&page=${currentPage}&apikey=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors', // Ensure CORS is enabled
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('API Response:', data); // Debug statement

        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
        } else {
            newsContainer.innerHTML = '<p class="text-gray-600 text-center">No news articles found matching your criteria.</p>';
        }

        updatePagination(data.totalArticles);
    } catch (error) {
        console.error('Error fetching news articles:', error);
        newsContainer.innerHTML = '<p class="text-red-500 text-center">Error fetching news articles. Please try again later.</p>';
    }
}

function displayNews(articles) {
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card', 'mb-4', 'p-4', 'bg-gray-50', 'rounded-lg', 'shadow');
        newsCard.innerHTML = `
            <h3 class="text-lg font-semibold mb-2">
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${article.title}</a>
            </h3>
            <p class="text-gray-700 mb-2">${article.description || 'No description available.'}</p>
            <div class="flex items-center text-sm text-gray-600">
                <span class="mr-4">Published at: ${new Date(article.publishedAt).toLocaleDateString()}</span>
                <span>Source: ${article.source.name}</span>
            </div>
        `;
        newsContainer.appendChild(newsCard);
    });
}

function updatePagination(totalResults) {
    const totalPages = Math.ceil(totalResults / articlesPerPage);
    console.log('Total Results:', totalResults); // Debug statement
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
        fetchNews();
    }
});

nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchNews();
});

searchInput.addEventListener('input', () => {
    currentPage = 1;
    fetchNews();
});

fetchNews();
