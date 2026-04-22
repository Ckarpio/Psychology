// import { API_URL } from "./const/const.js";

// window.currentEmotionMaterials = {};

// document.addEventListener('DOMContentLoaded', async function() {
//     const params = new URLSearchParams(window.location.search);
//     const emotionCode = params.get('emotion');
    
//     if (!emotionCode) {
//         displayError('Эмоция не выбрана');
//         return;
//     }
    
//     try {
//         const emotionsResponse = await fetch(`${API_URL}/api/emotions`);
//         const emotions = await emotionsResponse.json();
//         const emotionData = emotions.find(em => em.code === emotionCode);
        
//         if (!emotionData) {
//             displayError('Эмоция не найдена');
//             return;
//         }

//         displayEmotionInfo(emotionData);
//         await loadRecommendationsFromDB(emotionCode);
//         initTabs();
//         addBackButton();
        
//     } catch (error) {
//         console.error('Ошибка:', error);
//         displayError('Ошибка загрузки данных');
//     }
// });

// // Кнопка возврата
// function addBackButton() {
//     const container = document.querySelector('.container');
//     if (!container || document.querySelector('.back-to-main')) return;
    
//     const backButton = document.createElement('button');
//     backButton.className = 'back-to-main';
//     backButton.innerHTML = '<span>←</span> Вернуться на главную';
//     backButton.style.cssText = `
//         margin: 30px 0;
//         padding: 12px 28px;
//         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//         color: white;
//         border: none;
//         border-radius: 50px;
//         font-size: 16px;
//         font-weight: 600;
//         cursor: pointer;
//         transition: all 0.3s ease;
//         box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
//     `;
//     backButton.onclick = () => window.location.href = 'index.html';
//     container.appendChild(backButton);
// }

// // Обработка Pinterest
// function extractPinterestImageUrl(url) {
//     if (!url) return url;
//     if (url.includes('i.pinimg.com')) return url;
    
//     const pinMatch = url.match(/pinterest\.com\/pin\/(\d+)/i) || url.match(/pin\/(\d+)/i);
//     if (pinMatch) {
//         const pinId = pinMatch[1];
//         const folder = Math.abs(parseInt(pinId) % 1000).toString().padStart(3, '0');
//         return `https://i.pinimg.com/originals/${folder}/${pinId}.jpg`;
//     }
//     return url;
// }

// // Rutube embed
// function getRutubeEmbedUrl(url) {
//     if (!url || !url.includes('rutube.ru')) return null;
    
//     const match = url.match(/video\/([a-zA-Z0-9]+)/) || url.match(/embed\/([a-zA-Z0-9]+)/) || url.match(/[?&]v=([a-zA-Z0-9]+)/);
//     if (match) {
//         return {
//             embedUrl: `https://rutube.ru/play/embed/${match[1]}`,
//             videoId: match[1],
//             canEmbed: true
//         };
//     }
//     return null;
// }

// // VK парсинг
// function parseVKUrl(url) {
//     if (!url || !url.includes('vk.com')) return null;
//     return { type: 'track', icon: '🎵' };
// }

// // Загрузка данных
// async function loadRecommendationsFromDB(emotionCode) {
//     try {
//         const response = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
//         const data = await response.json();
        
//         if (data.material) {
//             window.currentEmotionMaterials = {
//                 music: data.material.music || [],
//                 video: data.material.video || [],
//                 images: data.material.images || [],
//                 exercises: data.material.exercises || [],
//                 articles: data.material.articles || []
//             };
//         }
//     } catch (error) {
//         console.error('Ошибка загрузки:', error);
//         displayError('Не удалось загрузить материалы');
//     }
// }

// // Отображение информации об эмоции
// function displayEmotionInfo(emotionData) {
//     const title = document.querySelector('h1');
//     const desc = document.querySelector('.info-box p');
//     if (!title || !desc) return;
    
//     title.textContent = emotionData.label || 'Эмоция';
//     desc.textContent = emotionData.description || '';
    
//     const infoBox = document.querySelector('.info-box');
//     if (infoBox && emotionData.color) {
//         infoBox.style.borderLeftColor = emotionData.color;
//         infoBox.style.backgroundColor = `${emotionData.color}20`;
//     }
// }

// // Инициализация вкладок
// function initTabs() {
//     const tabs = document.querySelectorAll('.tab');
//     if (!tabs.length) return;
    
//     const container = document.querySelector('.container');
//     const tabsContainer = document.querySelector('.tabs');
    
//     let contentContainer = document.querySelector('.tab-content-container');
//     if (!contentContainer) {
//         contentContainer = document.createElement('div');
//         contentContainer.className = 'tab-content-container';
//         tabsContainer?.insertAdjacentElement('afterend', contentContainer);
//     }
    
//     tabs.forEach(tab => {
//         tab.addEventListener('click', function() {
//             tabs.forEach(t => t.classList.remove('active'));
//             this.classList.add('active');
//             showTabContent(this.dataset.tab, contentContainer);
//         });
//     });
    
//     const defaultTab = document.querySelector('.tab.active') || tabs[0];
//     if (defaultTab) {
//         defaultTab.classList.add('active');
//         showTabContent(defaultTab.dataset.tab, contentContainer);
//     }
// }

// // Показ содержимого вкладки
// async function showTabContent(tabId, container) {
//     const items = window.currentEmotionMaterials[tabId] || [];
//     let html = `<h2 class="tab-title">${getIconForTab(tabId)} ${getTitleForTab(tabId)}</h2>`;
    
//     html += items.length ? await renderTabContent(tabId, items) : getEmptyStateHTML(tabId);
//     container.innerHTML = html;
// }

// function getIconForTab(tabId) {
//     const icons = { music: '🎵', video: '🎬', images: '🖼️', exercises: '🏋️', articles: '📄' };
//     return icons[tabId] || '📁';
// }

// function getTitleForTab(tabId) {
//     const titles = { music: 'Музыка', video: 'Видео', images: 'Картинки', exercises: 'Упражнения', articles: 'Статьи' };
//     return titles[tabId] || tabId;
// }

// async function renderTabContent(tabId, items) {
//     switch(tabId) {
//         case 'images': return renderImages(items);
//         case 'music': return renderMusic(items);
//         case 'video': return renderRutubeVideos(items);
//         case 'exercises': return renderRutubeExercises(items);
//         case 'articles': return renderArticles(items);
//         default: return '';
//     }
// }

// // Рендеринг изображений
// async function renderImages(items) {
//     let html = '<div class="images-gallery">';
    
//     for (const item of items) {
//         const imgUrl = extractPinterestImageUrl(item.url);
//         html += `
//             <div class="image-card" onclick="window.open('${imgUrl}', '_blank')">
//                 <div class="image-container">
//                     <img src="${imgUrl}" alt="${item.title}" loading="lazy"
//                          onerror="this.parentElement.innerHTML='<div class=\'image-error\'>🖼️</div>'">
//                 </div>
//                 <div class="image-info">
//                     <h4>${item.title || 'Изображение'}</h4>
//                     ${item.description ? `<p>${item.description}</p>` : ''}
//                 </div>
//             </div>
//         `;
//     }
    
//     return html + '</div>';
// }

// // Рендеринг музыки
// function renderMusic(items) {
//     let html = '<div class="music-list">';
    
//     items.forEach(item => {
//         html += `
//             <div class="music-card">
//                 <div class="music-icon">🎵</div>
//                 <div class="music-info">
//                     <h3>${item.title || 'Трек'}</h3>
//                     ${item.description ? `<p>${item.description}</p>` : ''}
//                     <a href="${item.url}" target="_blank" class="music-btn">Слушать в VK</a>
//                 </div>
//             </div>
//         `;
//     });
    
//     return html + '</div>';
// }

// // Рендеринг видео
// function renderRutubeVideos(items) {
//     let html = '<div class="video-list">';
    
//     items.forEach(item => {
//         const info = getRutubeEmbedUrl(item.url);
//         if (!info) return;
        
//         html += `
//             <div class="video-card">
//                 <h3>${item.title || 'Видео'}</h3>
//                 ${item.description ? `<p class="video-desc">${item.description}</p>` : ''}
//                 <div class="video-container">
//                     <iframe src="${info.embedUrl}" allowfullscreen></iframe>
//                 </div>
//                 <a href="${item.url}" target="_blank" class="video-btn">Смотреть на Rutube</a>
//             </div>
//         `;
//     });
    
//     return html + '</div>';
// }

// // Рендеринг упражнений (как видео)
// function renderRutubeExercises(items) {
//     let html = '<div class="video-list exercises-list">';
    
//     items.forEach(item => {
//         const info = getRutubeEmbedUrl(item.url);
//         if (!info) return;
        
//         html += `
//             <div class="video-card exercise-card">
//                 <h3>🏋️ ${item.title || 'Упражнение'}</h3>
//                 ${item.description ? `<p class="video-desc">${item.description}</p>` : ''}
//                 <div class="video-container">
//                     <iframe src="${info.embedUrl}" allowfullscreen></iframe>
//                 </div>
//                 <a href="${item.url}" target="_blank" class="exercise-btn">Смотреть упражнение</a>
//             </div>
//         `;
//     });
    
//     return html + '</div>';
// }

// // Рендеринг статей
// function renderArticles(items) {
//     let html = '<div class="articles-list">';
    
//     items.forEach(item => {
//         html += `
//             <div class="article-card">
//                 <h3>📄 ${item.title || 'Статья'}</h3>
//                 ${item.description ? `<div class="article-text">${item.description}</div>` : ''}
//                 ${item.url ? `<a href="${item.url}" target="_blank" class="article-btn">Читать статью</a>` : ''}
//             </div>
//         `;
//     });
    
//     return html + '</div>';
// }

// function getEmptyStateHTML(tabId) {
//     const messages = {
//         music: '🎵 Нет музыкальных материалов',
//         video: '🎬 Нет видео',
//         images: '🖼️ Нет изображений',
//         exercises: '🏋️ Нет упражнений',
//         articles: '📄 Нет статей'
//     };
    
//     return `<div class="empty-state">${messages[tabId] || 'Нет материалов'}</div>`;
// }

// function displayError(message) {
//     const title = document.querySelector('h1');
//     const desc = document.querySelector('.info-box p');
//     if (title) title.textContent = 'Ошибка';
//     if (desc) desc.textContent = message;
    
//     const tabs = document.querySelector('.tabs');
//     if (tabs) tabs.style.display = 'none';
    
//     const container = document.querySelector('.container');
//     if (container) {
//         const backBtn = document.createElement('button');
//         backBtn.className = 'back-to-main';
//         backBtn.innerHTML = '<span>←</span> Вернуться на главную';
//         backBtn.onclick = () => window.location.href = 'index.html';
//         container.appendChild(backBtn);
//     }
// }

// // Добавляем CSS в стиле первой страницы
// const style = document.createElement('style');
// style.textContent = `
//     .tab-title {
//         margin: 0 0 20px 0;
//         color: #333;
//         border-bottom: 2px solid #4CAF50;
//         padding-bottom: 10px;
//         font-size: 24px;
//     }
    
//     .images-gallery {
//         display: grid;
//         grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//         gap: 20px;
//         padding: 10px 0;
//     }
    
//     .image-card {
//         background: white;
//         border-radius: 12px;
//         overflow: hidden;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//         cursor: pointer;
//         transition: transform 0.3s;
//     }
    
//     .image-card:hover {
//         transform: translateY(-5px);
//         box-shadow: 0 8px 24px rgba(0,0,0,0.15);
//     }
    
//     .image-container {
//         width: 100%;
//         height: 200px;
//         background: #f5f5f5;
//     }
    
//     .image-container img {
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//     }
    
//     .image-error {
//         width: 100%;
//         height: 100%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-size: 48px;
//         color: #999;
//     }
    
//     .image-info {
//         padding: 15px;
//     }
    
//     .image-info h4 {
//         margin: 0 0 8px 0;
//         font-size: 18px;
//         color: #333;
//     }
    
//     .image-info p {
//         margin: 0;
//         color: #666;
//         font-size: 14px;
//     }
    
//     .music-list, .video-list, .articles-list {
//         display: flex;
//         flex-direction: column;
//         gap: 20px;
//     }
    
//     .music-card, .video-card, .article-card {
//         background: white;
//         border-radius: 12px;
//         padding: 20px;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//         transition: transform 0.3s;
//     }
    
//     .music-card:hover, .video-card:hover, .article-card:hover {
//         transform: translateY(-3px);
//         box-shadow: 0 8px 24px rgba(0,0,0,0.15);
//     }
    
//     .music-card {
//         display: flex;
//         gap: 20px;
//         align-items: center;
//     }
    
//     .music-icon {
//         font-size: 48px;
//         background: #0077FF20;
//         width: 70px;
//         height: 70px;
//         border-radius: 50%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//     }
    
//     .music-info {
//         flex: 1;
//     }
    
//     .music-info h3 {
//         margin: 0 0 8px 0;
//         font-size: 20px;
//         color: #333;
//     }
    
//     .music-info p {
//         margin: 0 0 15px 0;
//         color: #666;
//     }
    
//     .music-btn, .video-btn, .exercise-btn, .article-btn {
//         display: inline-block;
//         padding: 10px 20px;
//         background: #0077FF;
//         color: white;
//         text-decoration: none;
//         border-radius: 30px;
//         font-weight: 500;
//         transition: 0.3s;
//     }
    
//     .music-btn:hover {
//         background: #0066DD;
//     }
    
//     .video-container {
//         position: relative;
//         padding-bottom: 56.25%;
//         height: 0;
//         overflow: hidden;
//         border-radius: 8px;
//         margin: 15px 0;
//     }
    
//     .video-container iframe {
//         position: absolute;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         border: none;
//     }
    
//     .video-desc {
//         color: #666;
//         margin: 10px 0;
//     }
    
//     .exercise-card .video-btn {
//         background: #4CAF50;
//     }
    
//     .exercise-btn {
//         background: #4CAF50;
//     }
    
//     .exercise-btn:hover {
//         background: #3d8b40;
//     }
    
//     .article-card {
//         padding: 25px;
//     }
    
//     .article-card h3 {
//         margin: 0 0 15px 0;
//         font-size: 22px;
//         color: #333;
//     }
    
//     .article-text {
//         color: #444;
//         line-height: 1.6;
//         margin: 15px 0;
//         white-space: pre-wrap;
//     }
    
//     .article-btn {
//         background: #FF9800;
//     }
    
//     .article-btn:hover {
//         background: #f57c00;
//     }
    
//     .empty-state {
//         padding: 60px;
//         text-align: center;
//         background: linear-gradient(135deg, #f5f5f5, #fff);
//         border-radius: 16px;
//         color: #999;
//         font-size: 18px;
//     }
    
//     .back-to-main {
//         display: inline-flex;
//         align-items: center;
//         gap: 10px;
//         margin: 30px 0;
//         padding: 12px 28px;
//         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//         color: white;
//         border: none;
//         border-radius: 50px;
//         font-size: 16px;
//         font-weight: 600;
//         cursor: pointer;
//         transition: all 0.3s ease;
//         box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
//     }
    
//     .back-to-main:hover {
//         transform: translateY(-2px);
//         box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
//     }
    
//     @keyframes fadeIn {
//         from { opacity: 0; transform: translateY(10px); }
//         to { opacity: 1; transform: translateY(0); }
//     }
    
//     .tab-content-container {
//         animation: fadeIn 0.3s ease-out;
//     }
// `;
// document.head.appendChild(style);


import { API_URL } from "./const/const.js";

window.currentEmotionMaterials = {};

document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const emotionCode = params.get('emotion');
    
    if (!emotionCode) {
        displayError('Эмоция не выбрана');
        return;
    }
    
    try {
        const emotionsResponse = await fetch(`${API_URL}/api/emotions`);
        const emotions = await emotionsResponse.json();
        const emotionData = emotions.find(em => em.code === emotionCode);
        
        if (!emotionData) {
            displayError('Эмоция не найдена');
            return;
        }

        displayEmotionInfo(emotionData);
        await loadRecommendationsFromDB(emotionCode);
        initTabs();
        addBackButton();
        
    } catch (error) {
        console.error('Ошибка:', error);
        displayError('Ошибка загрузки данных');
    }
});

// Кнопка возврата
function addBackButton() {
    const container = document.querySelector('.container');
    if (!container || document.querySelector('.back-to-main')) return;
    
    const backButton = document.createElement('button');
    backButton.className = 'back-to-main';
    backButton.innerHTML = '<span>←</span> Вернуться на главную';
    backButton.style.cssText = `
        margin: 30px 0;
        padding: 12px 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    `;
    backButton.onclick = () => window.location.href = 'index.html';
    container.appendChild(backButton);
}

// Обработка Pinterest
function extractPinterestImageUrl(url) {
    if (!url) return url;
    if (url.includes('i.pinimg.com')) return url;
    
    const pinMatch = url.match(/pinterest\.com\/pin\/(\d+)/i) || url.match(/pin\/(\d+)/i);
    if (pinMatch) {
        const pinId = pinMatch[1];
        const folder = Math.abs(parseInt(pinId) % 1000).toString().padStart(3, '0');
        return `https://i.pinimg.com/originals/${folder}/${pinId}.jpg`;
    }
    return url;
}

// Rutube embed
function getRutubeEmbedUrl(url) {
    if (!url || !url.includes('rutube.ru')) return null;
    
    const match = url.match(/video\/([a-zA-Z0-9]+)/) || url.match(/embed\/([a-zA-Z0-9]+)/) || url.match(/[?&]v=([a-zA-Z0-9]+)/);
    if (match) {
        return {
            embedUrl: `https://rutube.ru/play/embed/${match[1]}`,
            videoId: match[1],
            canEmbed: true
        };
    }
    return null;
}

// VK парсинг
function parseVKUrl(url) {
    if (!url || !url.includes('vk.com')) return null;
    return { type: 'track', icon: '🎵' };
}

// Загрузка данных
async function loadRecommendationsFromDB(emotionCode) {
    try {
        const response = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
        const data = await response.json();
        
        if (data.material) {
            window.currentEmotionMaterials = {
                music: data.material.music || [],
                video: data.material.video || [],
                images: data.material.images || [],
                exercises: data.material.exercises || [],
                articles: data.material.articles || []
            };
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        displayError('Не удалось загрузить материалы');
    }
}

// Отображение информации об эмоции
function displayEmotionInfo(emotionData) {
    const title = document.querySelector('h1');
    const desc = document.querySelector('.info-box p');
    if (!title || !desc) return;
    
    title.textContent = emotionData.label || 'Эмоция';
    desc.textContent = emotionData.description || '';
    
    const infoBox = document.querySelector('.info-box');
    if (infoBox && emotionData.color) {
        infoBox.style.borderLeftColor = emotionData.color;
        infoBox.style.backgroundColor = `${emotionData.color}20`;
    }
}

// Инициализация вкладок
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    if (!tabs.length) return;
    
    const container = document.querySelector('.container');
    const tabsContainer = document.querySelector('.tabs');
    
    let contentContainer = document.querySelector('.tab-content-container');
    if (!contentContainer) {
        contentContainer = document.createElement('div');
        contentContainer.className = 'tab-content-container';
        tabsContainer?.insertAdjacentElement('afterend', contentContainer);
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            showTabContent(this.dataset.tab, contentContainer);
        });
    });
    
    const defaultTab = document.querySelector('.tab.active') || tabs[0];
    if (defaultTab) {
        defaultTab.classList.add('active');
        showTabContent(defaultTab.dataset.tab, contentContainer);
    }
}

// Показ содержимого вкладки
async function showTabContent(tabId, container) {
    const items = window.currentEmotionMaterials[tabId] || [];
    let html = `<h2 class="tab-title">${getIconForTab(tabId)} ${getTitleForTab(tabId)}</h2>`;
    
    html += items.length ? await renderTabContent(tabId, items) : getEmptyStateHTML(tabId);
    container.innerHTML = html;
}

function getIconForTab(tabId) {
    const icons = { music: '🎵', video: '🎬', images: '🖼️', exercises: '🏋️', articles: '📄' };
    return icons[tabId] || '📁';
}

function getTitleForTab(tabId) {
    const titles = { music: 'Музыка', video: 'Видео', images: 'Картинки', exercises: 'Упражнения', articles: 'Статьи' };
    return titles[tabId] || tabId;
}

async function renderTabContent(tabId, items) {
    switch(tabId) {
        case 'images': return renderImages(items);
        case 'music': return renderMusic(items);
        case 'video': return renderRutubeVideos(items);
        case 'exercises': return renderRutubeExercises(items);
        case 'articles': return renderArticles(items);
        default: return '';
    }
}

// Рендеринг изображений
async function renderImages(items) {
    let html = '<div class="images-gallery">';
    
    for (const item of items) {
        const imgUrl = extractPinterestImageUrl(item.url);
        html += `
            <div class="image-card" onclick="window.open('${imgUrl}', '_blank')">
                <div class="image-container">
                    <img src="${imgUrl}" alt="${item.title}" loading="lazy"
                         onerror="this.parentElement.innerHTML='<div class=\'image-error\'>🖼️</div>'">
                </div>
                <div class="image-info">
                    <h4>${escapeHtml(item.title || 'Изображение')}</h4>
                    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
                </div>
            </div>
        `;
    }
    
    return html + '</div>';
}

// Рендеринг музыки
function renderMusic(items) {
    let html = '<div class="music-list">';
    
    items.forEach(item => {
        html += `
            <div class="music-card">
                <div class="music-icon">🎵</div>
                <div class="music-info">
                    <h3>${escapeHtml(item.title || 'Трек')}</h3>
                    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
                    <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="music-btn">Слушать в VK</a>
                </div>
            </div>
        `;
    });
    
    return html + '</div>';
}

// Рендеринг видео
function renderRutubeVideos(items) {
    let html = '<div class="video-list">';
    
    items.forEach(item => {
        const info = getRutubeEmbedUrl(item.url);
        if (!info) return;
        
        html += `
            <div class="video-card">
                <h3>${escapeHtml(item.title || 'Видео')}</h3>
                ${item.description ? `<p class="video-desc">${escapeHtml(item.description)}</p>` : ''}
                <div class="video-container">
                    <iframe src="${info.embedUrl}" allowfullscreen></iframe>
                </div>
                <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="video-btn">Смотреть на Rutube</a>
            </div>
        `;
    });
    
    return html + '</div>';
}

// Рендеринг упражнений (как видео)
function renderRutubeExercises(items) {
    let html = '<div class="video-list exercises-list">';
    
    items.forEach(item => {
        const info = getRutubeEmbedUrl(item.url);
        if (!info) return;
        
        html += `
            <div class="video-card exercise-card">
                <h3>🏋️ ${escapeHtml(item.title || 'Упражнение')}</h3>
                ${item.description ? `<p class="video-desc">${escapeHtml(item.description)}</p>` : ''}
                <div class="video-container">
                    <iframe src="${info.embedUrl}" allowfullscreen></iframe>
                </div>
                <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="exercise-btn">Смотреть упражнение</a>
            </div>
        `;
    });
    
    return html + '</div>';
}

// Рендеринг статей (ОБНОВЛЕННАЯ ВЕРСИЯ - ПОДДЕРЖИВАЕТ ЛЮБЫЕ ССЫЛКИ)
function renderArticles(items) {
    let html = '<div class="articles-list">';
    
    items.forEach(item => {
        // Проверяем наличие URL
        const hasValidUrl = item.url && item.url.trim() !== '';
        
        // Определяем тип сайта для иконки
        let siteIcon = '🔗';
        let siteName = 'Перейти по ссылке';
        
        if (hasValidUrl) {
            const url = item.url.toLowerCase();
            if (url.includes('wikipedia.org')) {
                siteIcon = '📚';
                siteName = 'Читать в Wikipedia';
            } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
                siteIcon = '📺';
                siteName = 'Смотреть на YouTube';
            } else if (url.includes('rutube.ru')) {
                siteIcon = '🎬';
                siteName = 'Смотреть на Rutube';
            } else if (url.includes('vk.com')) {
                siteIcon = '🎵';
                siteName = 'Открыть ВКонтакте';
            } else if (url.includes('habr.com')) {
                siteIcon = '💻';
                siteName = 'Читать на Habr';
            } else if (url.includes('medium.com')) {
                siteIcon = '📝';
                siteName = 'Читать на Medium';
            } else if (url.includes('telegram.org') || url.includes('t.me')) {
                siteIcon = '📱';
                siteName = 'Открыть в Telegram';
            } else if (url.includes('zen.yandex.ru') || url.includes('dzen.ru')) {
                siteIcon = '📰';
                siteName = 'Читать в Дзен';
            }
        }
        
        html += `
            <div class="article-card">
                <h3>📄 ${escapeHtml(item.title || 'Статья')}</h3>
                ${item.description ? `<div class="article-text">${escapeHtml(item.description)}</div>` : ''}
                ${hasValidUrl ? `
                    <a href="${escapeHtml(item.url)}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="article-btn">
                        ${siteIcon} ${siteName}
                    </a>
                ` : ''}
            </div>
        `;
    });
    
    return html + '</div>';
}

// Вспомогательная функция для экранирования HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getEmptyStateHTML(tabId) {
    const messages = {
        music: '🎵 Нет музыкальных материалов',
        video: '🎬 Нет видео',
        images: '🖼️ Нет изображений',
        exercises: '🏋️ Нет упражнений',
        articles: '📄 Нет статей'
    };
    
    return `<div class="empty-state">${messages[tabId] || 'Нет материалов'}</div>`;
}

function displayError(message) {
    const title = document.querySelector('h1');
    const desc = document.querySelector('.info-box p');
    if (title) title.textContent = 'Ошибка';
    if (desc) desc.textContent = message;
    
    const tabs = document.querySelector('.tabs');
    if (tabs) tabs.style.display = 'none';
    
    const container = document.querySelector('.container');
    if (container) {
        const backBtn = document.createElement('button');
        backBtn.className = 'back-to-main';
        backBtn.innerHTML = '<span>←</span> Вернуться на главную';
        backBtn.onclick = () => window.location.href = 'index.html';
        container.appendChild(backBtn);
    }
}

// Добавляем CSS в стиле первой страницы
const style = document.createElement('style');
style.textContent = `
    .tab-title {
        margin: 0 0 20px 0;
        color: #333;
        border-bottom: 2px solid #4CAF50;
        padding-bottom: 10px;
        font-size: 24px;
    }
    
    .images-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        padding: 10px 0;
    }
    
    .image-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        cursor: pointer;
        transition: transform 0.3s;
    }
    
    .image-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    
    .image-container {
        width: 100%;
        height: 200px;
        background: #f5f5f5;
    }
    
    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .image-error {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        color: #999;
    }
    
    .image-info {
        padding: 15px;
    }
    
    .image-info h4 {
        margin: 0 0 8px 0;
        font-size: 18px;
        color: #333;
    }
    
    .image-info p {
        margin: 0;
        color: #666;
        font-size: 14px;
    }
    
    .music-list, .video-list, .articles-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .music-card, .video-card, .article-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: transform 0.3s;
    }
    
    .music-card:hover, .video-card:hover, .article-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    
    .music-card {
        display: flex;
        gap: 20px;
        align-items: center;
    }
    
    .music-icon {
        font-size: 48px;
        background: #0077FF20;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .music-info {
        flex: 1;
    }
    
    .music-info h3 {
        margin: 0 0 8px 0;
        font-size: 20px;
        color: #333;
    }
    
    .music-info p {
        margin: 0 0 15px 0;
        color: #666;
    }
    
    .music-btn, .video-btn, .exercise-btn, .article-btn {
        display: inline-block;
        padding: 10px 20px;
        background: #0077FF;
        color: white;
        text-decoration: none;
        border-radius: 30px;
        font-weight: 500;
        transition: 0.3s;
    }
    
    .music-btn:hover {
        background: #0066DD;
    }
    
    .video-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        border-radius: 8px;
        margin: 15px 0;
    }
    
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
    }
    
    .video-desc {
        color: #666;
        margin: 10px 0;
    }
    
    .exercise-card .video-btn {
        background: #4CAF50;
    }
    
    .exercise-btn {
        background: #4CAF50;
    }
    
    .exercise-btn:hover {
        background: #3d8b40;
    }
    
    .article-card {
        padding: 25px;
    }
    
    .article-card h3 {
        margin: 0 0 15px 0;
        font-size: 22px;
        color: #333;
    }
    
    .article-text {
        color: #444;
        line-height: 1.6;
        margin: 15px 0;
        white-space: pre-wrap;
    }
    
    .article-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: linear-gradient(135deg, #FF9800, #F57C00);
        color: white;
        text-decoration: none;
        border-radius: 30px;
        font-weight: 500;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
    }
    
    .article-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
        background: linear-gradient(135deg, #F57C00, #E65100);
    }
    
    .empty-state {
        padding: 60px;
        text-align: center;
        background: linear-gradient(135deg, #f5f5f5, #fff);
        border-radius: 16px;
        color: #999;
        font-size: 18px;
    }
    
    .back-to-main {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin: 30px 0;
        padding: 12px 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    .back-to-main:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .tab-content-container {
        animation: fadeIn 0.3s ease-out;
    }
    
    /* Адаптивность для мобильных устройств */
    @media (max-width: 768px) {
        .article-card {
            padding: 18px;
        }
        
        .article-card h3 {
            font-size: 18px;
        }
        
        .article-btn {
            padding: 10px 20px;
            font-size: 13px;
        }
        
        .music-card {
            flex-direction: column;
            text-align: center;
        }
        
        .images-gallery {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 15px;
        }
    }
`;
document.head.appendChild(style);