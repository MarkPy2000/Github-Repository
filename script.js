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
const sortBySelect = document.getElementById('sort-by');
const languageSearchInput = document.getElementById('language-search');
const clearLanguageSearchButton = document.getElementById('clear-language-search');
const languageSuggestions = document.getElementById('language-suggestions');
const repoDetailsModal = document.getElementById('repo-details-modal');
const closeModalButton = document.getElementById('close-modal');
const modalRepoName = document.getElementById('modal-repo-name');
const modalRepoDescription = document.getElementById('modal-repo-description');
const modalRepoStars = document.getElementById('modal-repo-stars');
const modalRepoForks = document.getElementById('modal-repo-forks');
const modalRepoLink = document.getElementById('modal-repo-link');
const loadingIndicator = document.getElementById('loading-indicator');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeIcon = document.getElementById('dark-mode-icon');
const autocompleteContainer = document.getElementById('autocomplete-container');

let currentPage = 1;
const reposPerPage = 10;
let isLoading = false;

const languages = [
    "1C Enterprise", "ABAP", "ABAP CDS", "ActionScript", "Ada", "Agda", "AGS Script", "AL", "Alloy", "Alpine Abuild", "AMPL", "AngelScript", "Ant Build System", "ANTLR", "ApacheConf", "Apex", "API Blueprint", "APL", "Apollo Guidance Computer", "AppleScript", "Arc", "AsciiDoc", "ASL", "ASP.NET", "AspectJ", "Assembly", "Astro", "Asymptote", "ATS", "Augeas", "AutoHotkey", "AutoIt", "Avro IDL", "Awk", "Ballerina", "BASIC", "Batchfile", "Beef", "Befunge", "Berry", "BibTeX", "Bicep", "Bikeshed", "Bison", "BitBake", "Blade", "BlitzBasic", "BlitzMax", "Bluespec", "Boo", "Boogie", "Brainfuck", "BrighterScript", "Brightscript", "Browserslist", "C", "C#", "C++", "C-ObjDump", "C2hs Haskell", "Cabal Config", "Cadence", "Cairo", "CAML", "Cap'n Proto", "CartoCSS", "Ceylon", "Chapel", "Charity", "ChucK", "Cirru", "Clarion", "Clarity", "Classic ASP", "Clean", "Click", "CLIPS", "Clojure", "Closure Templates", "Cloud Firestore Security Rules", "CMake", "COBOL", "CodeQL", "CoffeeScript", "ColdFusion", "ColdFusion CFC", "COLLADA", "Common Lisp", "Common Workflow Language", "Component Pascal", "CoNLL-U", "Cool", "Coq", "Cpp-ObjDump", "Creole", "Crystal", "CSON", "Csound", "Csound Document", "Csound Score", "CSV", "Cuda", "CUE", "cURL Config", "CWeb", "Cycript", "Cython", "D", "D-ObjDump", "Dafny", "Darcs Patch", "Dart", "DataWeave", "Debian Package Control File", "DenizenScript", "Dhall", "DIGITAL Command Language", "DirectX 3D File", "DM", "Dockerfile", "Dogescript", "DTrace", "Dylan", "E", "E-mail", "Eagle", "Earthly", "Easybuild", "EBNF", "eC", "Ecere Projects", "ECL", "ECLiPSe", "EditorConfig", "Edje Data Collection", "Eiffel", "EJS", "Elixir", "Elm", "Emacs Lisp", "EmberScript", "EQ", "Erlang", "F#", "F*", "Factor", "Fancy", "Fantom", "Faust", "Fennel", "FIGlet Font", "Filebench WML", "Filterscript", "fish", "Fluent", "FLUX", "Formatted", "Forth", "Fortran", "Fortran Free Form", "FreeBasic", "FreeMarker", "Frege", "Futhark", "G-code", "Game Maker Language", "GAML", "GAMS", "GAP", "GCC Machine Description", "GDB", "GDScript", "GEDCOM", "Gemfile.lock", "Genero", "Genero Forms", "Genie", "Genshi", "Gentoo Ebuild", "Gentoo Eclass", "Gerber Image", "Gettext Catalog", "Gherkin", "Git Attributes", "Git Config", "GLSL", "Glyph", "Glyph Bitmap Distribution Format", "GN", "Gnuplot", "Go", "Go Checksums", "Go Module", "Golo", "Gosu", "Grace", "Gradle", "Grammatical Framework", "Graph Modeling Language", "GraphQL", "Graphviz (DOT)", "Groovy", "Groovy Server Pages", "GSC", "Hack", "Haml", "Handlebars", "HAProxy", "Harbour", "Haskell", "Haxe", "HCL", "HiveQL", "HLSL", "HolyC", "HTML", "HTML+ECR", "HTML+EEX", "HTML+ERB", "HTML+PHP", "HTML+Razor", "HTTP", "HXML", "Hy", "HyPhy", "IDL", "Idris", "Ignore List", "IGOR Pro", "ImageJ Macro", "Imba", "Inform 7", "INI", "Inno Setup", "Io", "Ioke", "IRC log", "Isabelle", "Isabelle ROOT", "J", "JAR Manifest", "Jasmin", "Java", "Java Properties", "Java Server Pages", "JavaScript", "JavaScript+ERB", "Jest Snapshot", "JFlex", "Jinja", "Jison", "Jison Lex", "Jolie", "Jsonnet", "JSONiq", "JSSM", "JSX", "Julia", "Jupyter Notebook", "Kaitai Struct", "KakouneScript", "KiCad Layout", "KiCad Legacy Layout", "KiCad Schematic", "Kotlin", "KRL", "Kusto", "LabVIEW", "Lark", "Lasso", "Latte", "Lean", "Less", "Lex", "LFE", "LilyPond", "Limbo", "Liquid", "Literate Agda", "Literate CoffeeScript", "Literate Haskell", "LiveScript", "LLVM", "Logos", "Logtalk", "LOLCODE", "LookML", "LoomScript", "LSL", "LTspice Symbol", "Lua", "M", "M4", "M4Sugar", "Macaulay2", "Makefile", "Mako", "Markdown", "Marko", "Mask", "Mathematica", "MATLAB", "Maven POM", "Max", "MAXScript", "mcfunction", "Mercury", "Meson", "Metal", "Microsoft Developer Studio Project", "Microsoft Visual Studio Solution", "MiniD", "MiniYAML", "Mint", "Mirah", "mIRC Script", "MLIR", "Modelica", "Modula-2", "Modula-3", "Module Management System", "Monkey", "Moocode", "MoonScript", "Motoko", "Motorola 68K Assembly", "MQL4", "MQL5", "MTML", "MUF", "mupad", "Mustache", "Myghty", "nanorc", "NASL", "NCL", "Nearley", "Nemerle", "NEON", "nesC", "NetLinx", "NetLinx+ERB", "NetLogo", "NewLisp", "Nextflow", "Nginx", "Nim", "Ninja", "Nit", "Nix", "NL", "NPM Config", "NSIS", "Nu", "NumPy", "Nunjucks", "NWScript", "ObjDump", "Object Data Instance Notation", "Objective-C", "Objective-C++", "Objective-J", "ObjectScript", "OCaml", "Odin", "Omgrofl", "ooc", "Opa", "Opal", "Open Policy Agent", "OpenCL", "OpenEdge ABL", "OpenQASM", "OpenRC runscript", "OpenSCAD", "OpenStep Property List", "OpenType Feature File", "Org", "Ox", "Oxygene", "Oz", "P4", "Pan", "Papyrus", "Parrot", "Parrot Assembly", "Parrot Internal Representation", "Pascal", "Pawn", "PEG.js", "Pep8", "Perl", "PHP", "Pic", "Pickle", "PicoLisp", "PigLatin", "Pike", "PlantUML", "PLpgSQL", "PLSQL", "Pod", "Pod 6", "PogoScript", "Pony", "PostCSS", "PostScript", "POV-Ray SDL", "PowerBuilder", "PowerShell", "Prisma", "Processing", "Proguard", "Prolog", "Promela", "Propeller Spin", "Pug", "Puppet", "Pure Data", "PureBasic", "PureScript", "Python", "Python console", "Python traceback", "q", "Q#", "QMake", "QML", "Qt Script", "Quake", "R", "Racket", "Ragel", "Raku", "RAML", "Rascal", "Raw token data", "RDoc", "Readline Config", "REALbasic", "Reason", "Rebol", "Record Jar", "Red", "Redcode", "Redirect Rules", "Regular Expression", "Ren'Py", "RenderScript", "ReScript", "reStructuredText", "REXX", "Rich Text Format", "Ring", "Riot", "RMarkdown", "RobotFramework", "Roff", "Roff Manpage", "Rouge", "RPC", "RPM Spec", "Ruby", "RUNOFF", "Rust", "Sage", "SaltStack", "SAS", "Sass", "Scala", "Scaml", "Scheme", "Scilab", "SCSS", "sed", "Self", "ShaderLab", "Shell", "ShellCheck Config", "ShellSession", "Shen", "Sieve", "Singularity", "Slash", "Slice", "Slim", "Smali", "Smalltalk", "Smarty", "SmPL", "SMT", "Solidity", "Soong", "SourcePawn", "SPARQL", "Spline Font Database", "SQF", "SQL", "SQLPL", "Squirrel", "SRecode Template", "SSH Config", "Stan", "Standard ML", "Starlark", "Stata", "STON", "Stylus", "SubRip Text", "SugarSS", "SuperCollider", "Svelte", "SVG", "SWIG", "SystemVerilog", "Tcl", "Tcsh", "Tea", "Terra", "TeX", "Text", "Textile", "TextMate Properties", "Thrift", "TI Program", "TLA", "TOML", "TSQL", "TSV", "TSX", "Turing", "Turtle", "Twig", "TXL", "Type Language", "TypeScript", "Unified Parallel C", "Unity3D Asset", "Unix Assembly", "Uno", "UnrealScript", "UrWeb", "V", "Vala", "Valve Data Format", "VBA", "VBScript", "VCL", "Verilog", "VHDL", "Vim Help File", "Vim Script", "Vim Snippet", "Visual Basic .NET", "Volt", "Vue", "Wavefront Material", "Wavefront Object", "wdl", "Web Ontology Language", "WebAssembly", "WebIDL", "WebVTT", "Wget Config", "Whiley", "Wikitext", "Win32 Message File", "Windows Registry Entries", "wisp", "Wollok", "World of Warcraft Addon Data", "X BitMap", "X Font Directory Index", "X PixMap", "X10", "xBase", "XC", "XCompose", "XML", "XML Property List", "Xojo", "Xonsh", "XPages", "XProc", "XQuery", "XS", "XSLT", "Xtend", "Yacc", "YAML", "YANG", "YARA", "YASnippet", "ZAP", "Zeek", "ZenScript", "Zephir", "Zig", "ZIL", "Zimpl"
];

async function fetchRepos(sortBy = 'stars', language = '') {
    if (isLoading) return;
    isLoading = true;
    loadingIndicator.classList.remove('hidden');
    reposContainer.innerHTML = '<p class="text-gray-600 text-center">Loading repositories...</p>';

    try {
        const searchTerm = searchInput.value.trim();
        const query = searchTerm ? `${searchTerm}` : 'artificial-intelligence';
        const languageQuery = language ? `+language:${language}` : '';

        const response = await fetch(`https://api.github.com/search/repositories?q=${query}${languageQuery}&sort=${sortBy}&per_page=${reposPerPage}&page=${currentPage}`);

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
        loadingIndicator.classList.add('hidden');
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
        fetchRepos(sortBySelect.value, languageSearchInput.value);
    }
});

nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchRepos(sortBySelect.value, languageSearchInput.value);
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        autocompleteContainer.innerHTML = ''; // Clear the autocomplete suggestions
        currentPage = 1;
        fetchRepos(sortBySelect.value, languageSearchInput.value);
    }
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

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        darkModeIcon.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
    } else {
        darkModeIcon.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
    }
});

// Repository Sorting
sortBySelect.addEventListener('change', () => {
    const sortBy = sortBySelect.value;
    fetchRepos(sortBy, languageSearchInput.value);
});

// Language Search
languageSearchInput.addEventListener('input', () => {
    const searchTerm = languageSearchInput.value.trim().toLowerCase();
    languageSuggestions.innerHTML = '';

    if (searchTerm.length > 0) {
        const filteredLanguages = languages.filter(lang => lang.toLowerCase().includes(searchTerm));
        filteredLanguages.forEach(lang => {
            const suggestion = document.createElement('div');
            suggestion.classList.add('autocomplete-suggestion', 'p-2', 'cursor-pointer', 'hover:bg-gray-200');
            suggestion.textContent = lang;
            suggestion.addEventListener('click', () => {
                languageSearchInput.value = lang;
                languageSuggestions.innerHTML = '';
                fetchRepos(sortBySelect.value, lang);
            });
            languageSuggestions.appendChild(suggestion);
        });

        if (filteredLanguages.length > 0) {
            languageSuggestions.classList.remove('hidden');
        } else {
            languageSuggestions.classList.add('hidden');
        }
    } else {
        languageSuggestions.classList.add('hidden');
    }
});

document.addEventListener('click', (event) => {
    if (!languageSuggestions.contains(event.target)) {
        languageSuggestions.classList.add('hidden');
    }
});

// Clear Language Search
clearLanguageSearchButton.addEventListener('click', () => {
    languageSearchInput.value = '';
    languageSuggestions.innerHTML = '';
    languageSuggestions.classList.add('hidden');
    fetchRepos(sortBySelect.value, '');
});

// Repository Details Modal
function showRepoDetails(repo) {
    modalRepoName.textContent = repo.full_name;
    modalRepoDescription.textContent = repo.description || 'No description available.';
    modalRepoStars.textContent = `⭐ ${repo.stargazers_count} stars`;
    modalRepoForks.textContent = `🍴 ${repo.forks_count} forks`;
    modalRepoLink.href = repo.html_url;
    repoDetailsModal.classList.remove('hidden');
}

closeModalButton.addEventListener('click', () => {
    repoDetailsModal.classList.add('hidden');
});

reposContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        const repoCard = event.target.closest('.repo-card');
        const repo = {
            full_name: repoCard.querySelector('h3 a').textContent,
            description: repoCard.querySelector('p').textContent,
            stargazers_count: repoCard.querySelector('.flex span:first-child').textContent.split(' ')[1],
            forks_count: repoCard.querySelector('.flex span:last-child').textContent.split(' ')[1],
            html_url: repoCard.querySelector('h3 a').href
        };
        showRepoDetails(repo);
    }
});

// Search Autocomplete
searchInput.addEventListener('input', async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm.length < 3) {
        autocompleteContainer.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${searchTerm}&per_page=5`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        autocompleteContainer.innerHTML = '';

        data.items.forEach(repo => {
            const suggestion = document.createElement('div');
            suggestion.classList.add('autocomplete-suggestion', 'p-2', 'cursor-pointer', 'hover:bg-gray-200');
            suggestion.textContent = repo.full_name;
            suggestion.addEventListener('click', () => {
                searchInput.value = repo.full_name;
                autocompleteContainer.innerHTML = '';
                fetchRepos(sortBySelect.value, languageSearchInput.value);
            });
            autocompleteContainer.appendChild(suggestion);
        });
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
    }
});

document.addEventListener('click', (event) => {
    if (!autocompleteContainer.contains(event.target)) {
        autocompleteContainer.innerHTML = '';
    }
});

fetchRepos();
