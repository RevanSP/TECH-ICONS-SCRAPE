async function loadIcons() {
    try {
        const response = await fetch('public/scrapedIcons.json');
        const icons = await response.json();
        const container = document.getElementById('icons-container');
        const fallbackAlert = document.getElementById('fallback-alert');
        const searchInput = document.getElementById('search-input');

        function updatePlaceholder(iconsArray) {
            const totalIcons = iconsArray.length;
            searchInput.placeholder = `Search ... (${totalIcons} ICONS)`;
        }

        function displayIcons(filteredIcons) {
            container.innerHTML = '';
            if (filteredIcons.length === 0) {
                fallbackAlert.classList.remove('hidden');
            } else {
                fallbackAlert.classList.add('hidden');
                filteredIcons.forEach(icon => {
                    const iconElement = document.createElement('a');
                    iconElement.href = '#';
                    iconElement.classList.add(
                        'bg-base-300', 'border-2', 'border-neutral-content',
                        'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
                        'flex', 'flex-col', 'justify-center', 'items-center',
                        'space-y-2', 'w-full', 'h-auto', 'p-4', 'text-center',
                        'transition-all', 'duration-300', 'ease-in-out'
                    );

                    const imgElement = document.createElement('img');
                    imgElement.src = icon.imgSrc;
                    imgElement.alt = icon.text + ' icon';
                    imgElement.loading = 'lazy';
                    imgElement.height = 64;
                    imgElement.width = 64;
                    imgElement.classList.add(
                        'transition-all',
                        'duration-300',
                        'ease-in-out',
                        'transform',
                        'grayscale-0',
                        'hover:grayscale',
                        'hover:scale-75'
                    );
                    iconElement.appendChild(imgElement);

                    const textElement = document.createElement('p');
                    textElement.classList.add('text-xs', 'font-medium', 'min-h-8', 'flex', 'justify-center',
                        'items-center', 'break-words');
                    textElement.textContent = icon.text;
                    iconElement.appendChild(textElement);

                    container.appendChild(iconElement);
                });
            }
            updatePlaceholder(filteredIcons);
        }

        displayIcons(icons);

        searchInput.addEventListener('input', () => {
            const searchQuery = searchInput.value.toLowerCase();
            const filteredIcons = icons.filter(icon => icon.text.toLowerCase().includes(searchQuery));
            displayIcons(filteredIcons);
        });

    } catch (error) {
        console.error('Error loading icons:', error);
        const fallbackAlert = document.getElementById('fallback-alert');
        fallbackAlert.classList.remove('hidden');
        fallbackAlert.querySelector('span').textContent = 'Failed to load data. Please try again later.';
    }
}

loadIcons();