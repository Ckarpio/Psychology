import { API_URL } from "./const/const.js";

// Глобальная переменная для хранения материалов
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
        
        if (!emotionsResponse.ok) {
            throw new Error('Ошибка загрузки списка эмоций');
        }
        
        const emotions = await emotionsResponse.json();
        const emotionData = emotions.find(em => em.code === emotionCode);
        
        if (!emotionData) {
            displayError('Эмоция не найдена');
            return;
        }

        displayEmotionInfo(emotionData);
        await loadRecommendationsFromDB(emotionCode);
        initTabs();
        
        // Добавляем кнопку возврата после загрузки контента
        addBackButton();
        
    } catch (error) {
        console.error('Ошибка:', error);
        displayError('Ошибка загрузки данных с сервера');
    }
});

/**
 * Функция для добавления кнопки возврата на главную
 */
function addBackButton() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Проверяем, есть ли уже кнопка
    if (document.querySelector('.back-to-main')) return;
    
    const backButton = document.createElement('button');
    backButton.className = 'back-to-main';
    backButton.innerHTML = `
        <span style="font-size: 20px;">←</span>
        <span>Вернуться на главную</span>
    `;
    backButton.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin: 30px 0 20px 0;
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
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    // Добавляем эффекты при наведении
    backButton.addEventListener('mouseover', () => {
        backButton.style.transform = 'translateY(-3px)';
        backButton.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
    });
    
    backButton.addEventListener('mouseout', () => {
        backButton.style.transform = 'translateY(0)';
        backButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    });
    
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    container.appendChild(backButton);
}

/**
 * Функция для извлечения информации из ссылки VK
 */
function parseVKUrl(url) {
    if (!url) return null;
    
    // Проверяем, что это ссылка VK
    if (!url.includes('vk.com') && !url.includes('vk.ru')) {
        return null;
    }
    
    let trackInfo = {
        title: 'Трек в VK Музыке',
        artist: '',
        type: 'track',
        icon: '🎵',
        color: '#0077FF'
    };
    
    // Пытаемся извлечь информацию из разных паттернов VK ссылок
    
    // Паттерн: audio-20012345_12345678
    const audioMatch = url.match(/audio(-?\d+_\d+)/);
    if (audioMatch) {
        trackInfo.title = 'Аудиозапись VK';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'track';
    }
    
    // Паттерн: music/album/-20012345_12345678
    const albumMatch = url.match(/album[\/-](-?\d+_\d+)/);
    if (albumMatch) {
        trackInfo.title = 'Альбом';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'album';
        trackInfo.icon = '💿';
    }
    
    // Паттерн: music/playlist/-20012345_12345678
    const playlistMatch = url.match(/playlist[\/-](-?\d+_\d+)/);
    if (playlistMatch) {
        trackInfo.title = 'Плейлист';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'playlist';
        trackInfo.icon = '📀';
    }
    
    // Паттерн: artist/id
    const artistMatch = url.match(/artist[\/-](\d+)/);
    if (artistMatch) {
        trackInfo.title = 'Страница артиста';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'artist';
        trackInfo.icon = '👤';
    }
    
    // Пытаемся получить название из query параметров
    try {
        const urlObj = new URL(url);
        const qParam = urlObj.searchParams.get('q');
        if (qParam) {
            trackInfo.title = qParam;
            trackInfo.artist = 'Поиск VK';
        }
    } catch (e) {
        // Игнорируем ошибки парсинга URL
    }
    
    return trackInfo;
}

/**
 * Функция для определения типа ссылки VK
 */
function getVKLinkInfo(url) {
    if (!url) return null;
    
    // Проверяем, что это ссылка VK
    if (!url.includes('vk.com') && !url.includes('vk.ru')) {
        return null;
    }
    
    // Определяем тип контента
    if (url.includes('/music') || url.includes('/audio')) {
        if (url.includes('/playlist')) {
            return {
                type: 'playlist',
                icon: '📀',
                title: 'Плейлист в VK Музыке',
                color: '#0077FF'
            };
        } else if (url.includes('/album')) {
            return {
                type: 'album',
                icon: '💿',
                title: 'Альбом в VK Музыке',
                color: '#0077FF'
            };
        } else if (url.includes('/artist')) {
            return {
                type: 'artist',
                icon: '👤',
                title: 'Артист в VK Музыке',
                color: '#0077FF'
            };
        } else {
            return {
                type: 'track',
                icon: '🎵',
                title: 'Трек в VK Музыке',
                color: '#0077FF'
            };
        }
    } else if (url.includes('/video')) {
        return {
            type: 'video',
            icon: '🎬',
            title: 'Видео в VK',
            color: '#0077FF'
        };
    }
    
    return {
        type: 'vk',
        icon: '🔗',
        title: 'Ссылка VK',
        color: '#0077FF'
    };
}

/**
 * Функция для получения embed URL Rutube
 */
function getRutubeEmbedUrl(url) {
    if (!url || !url.includes('rutube.ru')) return null;
    
    console.log('Обрабатываем ссылку Rutube:', url);
    
    const patterns = [
        { regex: /video\/([a-zA-Z0-9]+)/, type: 'video' },
        { regex: /embed\/([a-zA-Z0-9]+)/, type: 'embed' },
        { regex: /[?&]v=([a-zA-Z0-9]+)/, type: 'param' },
        { regex: /\/([a-zA-Z0-9]{32,})/, type: 'direct' }
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern.regex);
        if (match) {
            const videoId = match[1];
            console.log('Найден ID видео Rutube:', videoId);
            return {
                embedUrl: `https://rutube.ru/play/embed/${videoId}`,
                videoId: videoId,
                platform: 'rutube',
                name: 'Rutube',
                color: '#34A1F0',
                icon: '🎬',
                canEmbed: true
            };
        }
    }
    
    if (url.includes('rutube.ru')) {
        console.warn('Не удалось извлечь ID из ссылки Rutube:', url);
        return {
            embedUrl: null,
            videoId: null,
            platform: 'rutube',
            name: 'Rutube',
            color: '#34A1F0',
            icon: '🎬',
            canEmbed: false
        };
    }
    
    return null;
}

/**
 * Загрузка рекомендаций из базы данных
 */
async function loadRecommendationsFromDB(emotionCode) {
    try {
        const response = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Данные из базы данных:', data);
        
        // Сохраняем данные как есть, без изменения структуры
        window.currentEmotionMaterials = data;
        console.log('Обработанные материалы из БД:', window.currentEmotionMaterials);
        
    } catch (error) {
        console.error('Ошибка при загрузке из базы данных:', error);
        displayError('Не удалось загрузить материалы из базы данных');
    }
}

function displayEmotionInfo(emotionData) {
    const titleElement = document.querySelector('h1');
    const descriptionElement = document.querySelector('.info-box p');
    
    if (!titleElement || !descriptionElement) {
        console.error('Элементы для отображения информации не найдены');
        return;
    }
    
    titleElement.textContent = emotionData.label || emotionData.name || 'Эмоция';
    descriptionElement.textContent = emotionData.description || '';
   
    const infoBox = document.querySelector('.info-box');
    if (infoBox && emotionData.color) {
        infoBox.style.borderLeftColor = emotionData.color;
        infoBox.style.backgroundColor = `${emotionData.color}20`; 
    }
    
    if (emotionData.effect) {
        document.body.classList.add(`emotion-${emotionData.effect}`);
    }
    
    addAdditionalInfo(emotionData);
}

function addAdditionalInfo(emotionData) {
    let additionalInfoContainer = document.querySelector('.additional-emotion-info');
    
    if (!additionalInfoContainer) {
        additionalInfoContainer = document.createElement('div');
        additionalInfoContainer.className = 'additional-emotion-info';
        
        const infoBox = document.querySelector('.info-box');
        if (infoBox && infoBox.parentNode) {
            infoBox.parentNode.insertBefore(additionalInfoContainer, infoBox.nextSibling);
        }
    }
    
    let additionalHtml = '';
    
    if (emotionData.effect) {
        additionalHtml += `<p><strong>Тип:</strong> ${emotionData.effect === 'positive' ? 'Позитивная' : 'Негативная'}</p>`;
    }
    
    additionalInfoContainer.innerHTML = additionalHtml;
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    if (tabs.length === 0) {
        console.error('Вкладки не найдены');
        return;
    }
    
    const container = document.querySelector('.container');
    const tabsContainer = document.querySelector('.tabs');
    
    let contentContainer = document.querySelector('.tab-content-container');
    if (!contentContainer) {
        contentContainer = document.createElement('div');
        contentContainer.className = 'tab-content-container';
        if (tabsContainer && container) {
            container.insertBefore(contentContainer, tabsContainer.nextSibling);
        }
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            showTabContent(tabId, contentContainer);
        });
    });
    
    const defaultTab = document.querySelector('.tab');
    if (defaultTab) {
        defaultTab.classList.add('active');
        const defaultTabId = defaultTab.getAttribute('data-tab');
        showTabContent(defaultTabId, contentContainer);
    }
}

async function showTabContent(tabId, container) {
    const materials = window.currentEmotionMaterials || {};
    
    let items = [];
    
    // Определяем, откуда брать данные в зависимости от вкладки
    if (tabId === 'music') {
        items = materials.music || [];
    } else if (tabId === 'video') {
        items = materials.video || [];
    } else if (tabId === 'images') {
        items = materials.images || [];
    } else if (tabId === 'exercises') {
        items = materials.exercises || [];
    } else if (tabId === 'articles') {
        items = materials.articles || [];
    }
    
    console.log(`Рендерим вкладку ${tabId}, элементов:`, items.length);
    
    let html = `<h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">${getIconForTab(tabId)} ${getTitleForTab(tabId)}</h2>`;
    
    if (items && items.length > 0) {
        html += renderTabContent(tabId, items);
    } else {
        html += getEmptyStateHTML(tabId);
    }
    
    container.innerHTML = html;
}

function getIconForTab(tabId) {
    const icons = {
        'music': '🎵',
        'video': '🎬',
        'images': '🖼️',
        'exercises': '📋',
        'articles': '💡'
    };
    return icons[tabId] || '📁';
}

function getTitleForTab(tabId) {
    const titles = {
        'music': 'Музыка',
        'video': 'Видео',
        'images': 'Фотографии',
        'exercises': 'Упражнения',
        'articles': 'Советы и статьи'
    };
    return titles[tabId] || tabId;
}

function renderTabContent(tabId, items) {
    switch(tabId) {
        case 'images':
            return renderImages(items);
        case 'music':
            return renderMusic(items);
        case 'video':
            return renderRutubeVideos(items);
        case 'exercises':
            return renderExercises(items);
        case 'articles':
            return renderArticles(items);
        default:
            return renderDefault(items);
    }
}

/**
 * Рендеринг фотографий (поле изображения)
 */
function renderImages(items) {
    let html = '<div class="images-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding: 20px 0;">';
    
    let hasImages = false;
    
    items.forEach((item) => {
        // Используем русское поле "изображения"
        const imageUrl = item.изображения;
        
        if (!imageUrl) return;
        
        hasImages = true;
        const title = item.название || 'Фотография';
        const description = item.описание || '';
        const author = item.автор || '';
        
        html += `
            <div class="image-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s ease; cursor: pointer;" 
                 onclick="window.open('${imageUrl}', '_blank')"
                 onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.15)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';">
                
                <div style="position: relative; width: 100%; height: 220px; background: #f5f5f5; overflow: hidden;">
                    <img src="${imageUrl}" 
                         alt="${title}" 
                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;"
                         onerror="this.onerror=null; 
                                  this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f0f0f0;color:#999;\'><span style=\'font-size:48px;\'>🖼️</span><span style=\'margin-top:10px;\'>Фото не доступно</span></div>';">
                </div>
                
                <div style="padding: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px; font-weight: 600; line-height: 1.3;">${title}</h4>
                    ${author ? `<div style="margin: 0 0 8px 0; color: #666; font-size: 14px;">📷 ${author}</div>` : ''}
                    ${description ? `<p style="margin: 0 0 12px 0; color: #666; font-size: 14px; line-height: 1.5;">${description}</p>` : ''}
                    
                    <div style="margin-top: 12px;">
                        <span style="background: #4CAF5020; color: #4CAF50; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                            🖼️ Фотография
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    if (!hasImages) {
        return '<div style="padding: 40px; text-align: center; color: #666;">📷 Нет доступных фотографий</div>';
    }
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг музыки
 */
function renderMusic(items) {
    let html = '<div class="music-list">';
    
    items.forEach((item) => {
        const audioUrl = item.url || '';
        
        if (!audioUrl) return;
        
        const isVK = audioUrl.includes('vk.com') || audioUrl.includes('vk.ru');
        const vkInfo = getVKLinkInfo(audioUrl);
        const trackTitle = item.название || 'Трек';
        const artist = item.автор || '';
        
        if (isVK) {
            html += `
                <div class="music-item vk-music" style="margin-bottom: 25px; padding: 30px; background: linear-gradient(135deg, #0077FF08 0%, #0077FF15 100%); border: 1px solid #0077FF30; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,119,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 25px; flex-wrap: wrap;">
                        <div style="background: #0077FF; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,119,255,0.3);">
                            <span style="font-size: 40px; color: white;">${vkInfo?.icon || '🎵'}</span>
                        </div>
                        
                        <div style="flex: 2; min-width: 300px;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                <span style="background: #0077FF20; color: #0077FF; padding: 5px 15px; border-radius: 30px; font-size: 14px; font-weight: 500;">
                                    VK Музыка
                                </span>
                            </div>
                            
                            <h3 style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 28px; font-weight: 700; line-height: 1.3;">${trackTitle}</h3>
                            
                            ${artist ? `<div style="margin: 0 0 20px 0; color: #0077FF; font-size: 22px; font-weight: 600;">${artist}</div>` : ''}
                            
                            <a href="${audioUrl}" target="_blank" 
                               style="display: inline-flex; align-items: center; justify-content: center; gap: 12px; 
                                      background: #0077FF; color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600;"
                               onmouseover="this.style.background='#0066DD';"
                               onmouseout="this.style.background='#0077FF';">
                                <span style="font-size: 24px;">🎧</span>
                                <span>Слушать в VK Музыке</span>
                                <span style="font-size: 20px;">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг видео с Rutube
 */
function renderRutubeVideos(items) {
    let html = '<div class="video-list rutube-videos">';
    let hasValidVideos = false;
    
    items.forEach((item) => {
        const videoUrl = item.url || '';
        
        if (!videoUrl) return;
        
        const rutubeInfo = getRutubeEmbedUrl(videoUrl);
        
        if (rutubeInfo) {
            hasValidVideos = true;
            const videoTitle = item.название || 'Видео на Rutube';
            const videoAuthor = item.автор || '';
            
            if (rutubeInfo.canEmbed && rutubeInfo.embedUrl) {
                html += `
                    <div class="video-item rutube-video" style="margin-bottom: 40px; padding: 25px; background: linear-gradient(135deg, #34A1F008 0%, #34A1F015 100%); border: 2px solid #34A1F030; border-radius: 24px;">
                        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #34A1F030;">
                            <div style="background: #34A1F0; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 30px; color: white;">🎬</span>
                            </div>
                            <div style="flex: 1;">
                                <h3 style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 26px; font-weight: 700;">${videoTitle}</h3>
                                ${videoAuthor ? `<div style="color: #34A1F0; font-size: 18px;">${videoAuthor}</div>` : ''}
                                ${item.описание ? `<p style="margin: 15px 0 0 0; color: #666;">${item.описание}</p>` : ''}
                            </div>
                        </div>
                        
                        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; margin-bottom: 20px; background: #000;">
                            <iframe src="${rutubeInfo.embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                        </div>
                        
                        <a href="${videoUrl}" target="_blank" 
                           style="display: inline-flex; align-items: center; gap: 8px; background: #34A1F0; color: white; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: 600;">
                            <span>Смотреть на Rutube</span>
                            <span>→</span>
                        </a>
                    </div>
                `;
            }
        }
    });
    
    if (!hasValidVideos) {
        html += '<div style="padding: 80px 20px; text-align: center; color: #666;">🎬 Нет видео с Rutube для этой эмоции</div>';
    }
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг упражнений (поле описание)
 */
function renderExercises(items) {
    let html = '<div class="exercises-list">';
    
    items.forEach((item) => {
        // Используем поле "описание" для текста упражнения
        const exerciseText = item.описание || item.text || '';
        const title = item.название || 'Упражнение';
        const author = item.автор || '';
        
        if (!exerciseText) return;
        
        html += `
            <div class="exercise-item" style="margin-bottom: 25px; padding: 30px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="background: #4CAF50; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px; color: white;">🏋️</span>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #333; font-size: 24px; font-weight: 600;">${title}</h3>
                        ${author ? `<div style="color: #4CAF50;">${author}</div>` : ''}
                    </div>
                </div>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border-left: 4px solid #4CAF50;">
                    <div style="line-height: 1.8; color: #444; font-size: 16px; white-space: pre-wrap;">
                        ${exerciseText.split('\n').map(p => p.trim() ? `<p style="margin-bottom: 15px;">${p}</p>` : '').join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг советов и статей (поле описание)
 */
function renderArticles(items) {
    let html = '<div class="articles-list">';
    
    items.forEach((item) => {
        // Используем поле "описание" для текста статьи
        const articleText = item.описание || item.text || '';
        const title = item.название || 'Статья';
        const author = item.автор || '';
        
        if (!articleText) return;
        
        html += `
            <div class="article-item" style="margin-bottom: 25px; padding: 30px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="background: #2196F3; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px; color: white;">💡</span>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #333; font-size: 26px; font-weight: 700;">${title}</h3>
                        ${author ? `<div style="color: #2196F3;">${author}</div>` : ''}
                    </div>
                </div>
                
                <div style="background: #ffffff; padding: 20px; border-radius: 12px; border-left: 4px solid #2196F3; line-height: 1.8; color: #444; font-size: 16px; white-space: pre-wrap;">
                    ${articleText.split('\n').map(p => p.trim() ? `<p style="margin-bottom: 15px;">${p}</p>` : '').join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderDefault(items) {
    let html = '<div class="default-list"><pre>' + JSON.stringify(items, null, 2) + '</pre></div>';
    return html;
}

function getEmptyStateHTML(tabId) {
    const messages = {
        'music': '🎵 Нет музыкальных материалов',
        'video': '🎬 Нет видео',
        'images': '🖼️ Нет фотографий',
        'exercises': '📋 Нет упражнений',
        'articles': '💡 Нет советов и статей'
    };
    
    return `<div style="padding: 80px 20px; text-align: center; color: #999;">${messages[tabId]}</div>`;
}

function displayError(message) {
    const titleElement = document.querySelector('h1');
    const descriptionElement = document.querySelector('.info-box p');
    
    if (titleElement) titleElement.textContent = 'Ошибка';
    if (descriptionElement) descriptionElement.textContent = message;
    
    const tabs = document.querySelector('.tabs');
    if (tabs) tabs.style.display = 'none';
    
    const container = document.querySelector('.container');
    if (container) {
        const backButton = document.createElement('button');
        backButton.innerHTML = '<span>←</span> <span>Вернуться на главную</span>';
        backButton.style.cssText = 'margin: 30px 0; padding: 12px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 50px; cursor: pointer;';
        backButton.onclick = () => window.location.href = 'index.html';
        container.appendChild(backButton);
    }
}

// Добавляем CSS
const style = document.createElement('style');
style.textContent = `
    .music-item, .video-item, .exercise-item, .article-item, .image-item {
        transition: all 0.3s ease;
    }
    .music-item:hover, .video-item:hover, .exercise-item:hover, .article-item:hover, .image-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .tab-content-container {
        animation: fadeIn 0.4s ease-out;
    }
    audio {
        width: 100%;
        border-radius: 40px;
    }
`;
document.head.appendChild(style);