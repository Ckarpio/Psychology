
const params = new URLSearchParams(window.location.search)
const selectedEmotion= params.get('emotion')
console.log(selectedEmotion)
const properties = localStorage.getItem(selectedEmotion)
console.log(JSON.parse(properties))




document.addEventListener('DOMContentLoaded', function() {
    initTabs();
});

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            
            tabs.forEach(t => t.classList.remove('active'));
            
        
            this.classList.add('active');
        
            
            const tabType = this.dataset.tab;
            
        
            loadTabContent(tabType);
        });
    });
}

function loadTabContent(tabType) {
    console.log(`Загрузка контента для вкладки: ${tabType}`);
    


    switch(tabType) {
        case 'music':
            console.log('Загружаем музыку...');
            break;
        case 'video':
            console.log('Загружаем видео...');
            break;
        case 'images':
            console.log('Загружаем картинки...');
            break;
        case 'exercises':
            console.log('Загружаем упражнения...');
            break;
        case 'articles':
            console.log('Загружаем статьи...');
            break;
    }
}