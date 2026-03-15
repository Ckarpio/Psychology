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
 * Функция для извлечения информации из ссылки VK (ВОССТАНОВЛЕНА)
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
 * Функция для определения типа ссылки VK (ВОССТАНОВЛЕНА)
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
 * Функция для получения embed URL Rutube (ВОССТАНОВЛЕНА)
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
 * Функция для извлечения ID изображения из ссылки Pinterest
 */
function extractPinterestImageUrl(url) {
    if (!url) return null;
    
    // Если это уже прямая ссылка на изображение Pinterest
    if (url.includes('i.pinimg.com') && (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg') || url.includes('.webp'))) {
        return url;
    }
    
    // Пробуем извлечь ID из разных форматов ссылок Pinterest
    const pinMatch = url.match(/pinterest\.com\/pin\/(\d+)/i) || 
                     url.match(/pin\/(\d+)/i) ||
                     url.match(/\/pin\/(\d+)/i);
    
    if (pinMatch) {
        const pinId = pinMatch[1];
        const folder = Math.abs(parseInt(pinId) % 1000).toString().padStart(3, '0');
        return `https://i.pinimg.com/originals/${folder}/${pinId}.jpg`;
    }
    
    // Если это pin.it ссылка, возвращаем как есть
    if (url.includes('pin.it/')) {
        console.warn('⚠️ Используйте прямые ссылки на изображения Pinterest (i.pinimg.com) для лучшей совместимости');
        return url;
    }
    
    return url;
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
        console.log('📦 Данные из БД:', data);
        
        // Группируем данные по типу
        const groupedData = {
            music: [],
            video: [],
            images: [],
            exercises: [],
            articles: []
        };
        
        // Если данные пришли как массив - группируем
        if (Array.isArray(data)) {
            data.forEach(item => {
                const type = item.type?.toLowerCase();
                
                const unifiedItem = {
                    id: item.id,
                    title: item.title || 'Без названия',
                    description: item.description || item.tip || '',
                    url: item.url || '', // ВСЕ ссылки в колонке url
                    author: item.author || ''
                };
                
                switch(type) {
                    case 'music':
                        groupedData.music.push(unifiedItem);
                        break;
                    case 'video':
                        groupedData.video.push(unifiedItem);
                        break;
                    case 'image':
                        groupedData.images.push(unifiedItem);
                        break;
                    case 'exercise':
                        groupedData.exercises.push(unifiedItem);
                        break;
                    case 'article':
                        groupedData.articles.push(unifiedItem);
                        break;
                    default:
                        console.log('Неизвестный тип:', type, item);
                }
            });
        } else {
            // Если данные уже сгруппированы
            groupedData.music = data.music || [];
            groupedData.video = data.video || [];
            groupedData.images = data.images || [];
            groupedData.exercises = data.exercises || [];
            groupedData.articles = data.articles || [];
        }
        
        console.log('📦 Сгруппированные данные:', groupedData);
        window.currentEmotionMaterials = groupedData;
        
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        displayError('Не удалось загрузить материалы из базы данных');
    }
}

function displayEmotionInfo(emotionData) {
    const titleElement = document.querySelector('h1');
    const descriptionElement = document.querySelector('.info-box p');
    
    if (!titleElement || !descriptionElement) return;
    
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
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length === 0) return;
    
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
        showTabContent(defaultTab.getAttribute('data-tab'), contentContainer);
    }
}

async function showTabContent(tabId, container) {
    const materials = window.currentEmotionMaterials || {};
    
    let items = [];
    switch(tabId) {
        case 'music':
            items = materials.music || [];
            break;
        case 'video':
            items = materials.video || [];
            break;
        case 'images':
            items = materials.images || [];
            break;
        case 'exercises':
            items = materials.exercises || [];
            break;
        case 'articles':
            items = materials.articles || [];
            break;
    }
    
    let html = `<h2 style="margin: 0 0 20px 0; color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">${getIconForTab(tabId)} ${getTitleForTab(tabId)}</h2>`;
    
    if (items.length > 0) {
        html += await renderTabContent(tabId, items);
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

async function renderTabContent(tabId, items) {
    switch(tabId) {
        case 'images':
            return await renderImages(items);
        case 'music':
            return renderMusic(items);
        case 'video':
            return renderVideos(items);
        case 'exercises':
            return renderExercises(items);
        case 'articles':
            return renderArticles(items);
        default:
            return renderDefault(items);
    }
}

/**
 * Рендеринг фотографий
 */
async function renderImages(items) {
    let html = '<div class="images-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding: 20px 0;">';
    let hasImages = false;
    
    for (const item of items) {
        const originalUrl = item.url || '';
        if (!originalUrl) continue;
        
        const imageUrl = extractPinterestImageUrl(originalUrl);
        hasImages = true;
        
        // Определяем источник
        const isPinterest = imageUrl.includes('i.pinimg.com');
        
        html += `
            <div class="image-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); cursor: pointer;" 
                 onclick="window.open('${imageUrl}', '_blank')"
                 onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.15)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';">
                
                <div style="position: relative; width: 100%; height: 220px; background: #f5f5f5; overflow: hidden;">
                    <img src="${imageUrl}" 
                         alt="${item.title}" 
                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;"
                         onerror="this.onerror=null; 
                                  this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;color:#999;\'>🖼️ Фото не доступно</div>';">
                </div>
                
                <div style="padding: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px; font-weight: 600;">${item.title}</h4>
                    ${item.description ? `<p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">${item.description}</p>` : ''}
                    
                    <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                        <span style="background: #4CAF5020; color: #4CAF50; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                            🖼️ Фото
                        </span>
                        ${isPinterest ? `
                            <span style="background: #E6002320; color: #E60023; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                                📌 Pinterest
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    return hasImages ? html + '</div>' : '<div style="padding: 60px; text-align: center; color: #999;">🖼️ Нет фотографий</div>';
}

/**
 * Рендеринг музыки (ВОССТАНОВЛЕН полный функционал VK)
 */
function renderMusic(items) {
    let html = '<div class="music-list">';
    let hasMusic = false;
    
    items.forEach(item => {
        const audioUrl = item.url || '';
        if (!audioUrl || !audioUrl.includes('vk.com')) return;
        
        hasMusic = true;
        
        // Пытаемся извлечь информацию из ссылки VK
        const vkParsedInfo = parseVKUrl(audioUrl);
        const vkInfo = getVKLinkInfo(audioUrl);
        
        // Используем информацию из парсинга ссылки
        const trackTitle = vkParsedInfo?.title || item.title || 'Трек в VK Музыке';
        const artist = vkParsedInfo?.artist || item.author || '';
        
        html += `
            <div class="music-item vk-music" style="margin-bottom: 25px; padding: 30px; background: linear-gradient(135deg, #0077FF08 0%, #0077FF15 100%); border: 1px solid #0077FF30; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,119,255,0.1);">
                <div style="display: flex; align-items: center; gap: 25px; flex-wrap: wrap;">
                    <!-- VK Иконка -->
                    <div style="background: #0077FF; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,119,255,0.3);">
                        <span style="font-size: 40px; color: white;">${vkInfo?.icon || '🎵'}</span>
                    </div>
                    
                    <!-- Информация о треке -->
                    <div style="flex: 2; min-width: 300px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="background: #0077FF20; color: #0077FF; padding: 5px 15px; border-radius: 30px; font-size: 14px; font-weight: 500;">
                                VK Музыка
                            </span>
                            <span style="color: #999; font-size: 14px;">
                                ${vkInfo?.type === 'playlist' ? 'Плейлист' : 
                                  vkInfo?.type === 'album' ? 'Альбом' : 
                                  vkInfo?.type === 'artist' ? 'Артист' : 'Трек'}
                            </span>
                        </div>
                        
                        <!-- Название трека -->
                        <h3 style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 28px; font-weight: 700; line-height: 1.3;">
                            ${trackTitle}
                        </h3>
                        
                        <!-- Исполнитель (если есть) -->
                        ${artist ? `
                            <div style="margin: 0 0 20px 0; color: #0077FF; font-size: 22px; font-weight: 600;">
                                ${artist}
                            </div>
                        ` : ''}
                        
                        <!-- Кнопка перехода в VK -->
                        <a href="${audioUrl}" target="_blank" 
                           style="display: inline-flex; align-items: center; justify-content: center; gap: 12px; 
                                  background: #0077FF; 
                                  color: white; 
                                  text-decoration: none; 
                                  padding: 16px 32px; 
                                  border-radius: 50px; 
                                  font-weight: 600; 
                                  font-size: 16px;
                                  letter-spacing: 0.5px;
                                  transition: all 0.3s ease;
                                  box-shadow: 0 8px 20px rgba(0,119,255,0.3);
                                  border: 1px solid rgba(255,255,255,0.2);
                                  width: fit-content;"
                           onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 15px 30px rgba(0,119,255,0.4)'; this.style.background='#0066DD';"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(0,119,255,0.3)'; this.style.background='#0077FF';">
                            <span style="font-size: 24px;">🎧</span>
                            <span>Слушать в VK Музыке</span>
                            <span style="font-size: 20px;">→</span>
                        </a>
                        
                        <!-- Дополнительная информация -->
                        <div style="margin-top: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
                            <span style="color: #999; font-size: 13px; display: flex; align-items: center; gap: 5px;">
                                <span style="color: #0077FF;">●</span> Требуется авторизация VK
                            </span>
                            <span style="color: #999; font-size: 13px; display: flex; align-items: center; gap: 5px;">
                                <span style="color: #0077FF;">●</span> Доступно в приложении VK
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    return hasMusic ? html + '</div>' : '<div style="padding: 60px; text-align: center; color: #999;">🎵 Нет музыки</div>';
}

/**
 * Рендеринг видео (ВОССТАНОВЛЕН полный функционал Rutube)
 */
function renderVideos(items) {
    let html = '<div class="video-list rutube-videos">';
    let hasValidVideos = false;
    
    items.forEach(item => {
        const videoUrl = item.url || '';
        if (!videoUrl) return;
        
        // Получаем информацию о видео Rutube
        const rutubeInfo = getRutubeEmbedUrl(videoUrl);
        
        // Показываем только видео с Rutube
        if (rutubeInfo) {
            hasValidVideos = true;
            
            // Получаем название видео и автора
            const videoTitle = item.title || 'Видео на Rutube';
            const videoAuthor = item.author || '';
            
            // Если есть embed URL - показываем плеер
            if (rutubeInfo.canEmbed && rutubeInfo.embedUrl) {
                html += `
                    <div class="video-item rutube-video" style="margin-bottom: 40px; padding: 25px; background: linear-gradient(135deg, #34A1F008 0%, #34A1F015 100%); border: 2px solid #34A1F030; border-radius: 24px; box-shadow: 0 15px 30px rgba(52,161,240,0.15);">
                        <!-- Заголовок видео -->
                        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #34A1F030;">
                            <div style="background: #34A1F0; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 15px rgba(52,161,240,0.3);">
                                <span style="font-size: 30px; color: white;">🎬</span>
                            </div>
                            <div style="flex: 1;">
                                <h3 style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 26px; font-weight: 700; line-height: 1.3;">${videoTitle}</h3>
                                <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                                    ${videoAuthor ? `<span style="color: #34A1F0; font-size: 18px; font-weight: 500;">${videoAuthor}</span>` : ''}
                                    <span style="background: #34A1F020; color: #34A1F0; padding: 4px 12px; border-radius: 30px; font-size: 13px; font-weight: 500;">
                                        Rutube
                                    </span>
                                </div>
                                ${item.description ? `<p style="margin: 15px 0 0 0; color: #666; line-height: 1.6;">${item.description}</p>` : ''}
                            </div>
                        </div>
                        
                        <!-- Rutube плеер -->
                        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; margin-bottom: 20px; background: #000; box-shadow: 0 10px 25px rgba(52,161,240,0.3);">
                            <iframe 
                                src="${rutubeInfo.embedUrl}" 
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 16px;"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen>
                            </iframe>
                        </div>
                        
                        <!-- Информация и ссылки -->
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; padding: 0 10px;">
                            <div style="display: flex; gap: 15px; align-items: center;">
                                <span style="color: #34A1F0; font-size: 14px; background: #34A1F010; padding: 4px 12px; border-radius: 20px;">
                                    🆔 ID: ${rutubeInfo.videoId ? rutubeInfo.videoId.substring(0, 8) + '...' : 'загрузка'}
                                </span>
                            </div>
                            <a href="${videoUrl}" target="_blank" 
                               style="display: inline-flex; align-items: center; gap: 8px; background: #34A1F0; color: white; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 15px; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(52,161,240,0.3);"
                               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 18px rgba(52,161,240,0.4)'; this.style.background='#2A8CD0';"
                               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(52,161,240,0.3)'; this.style.background='#34A1F0';">
                                <span>Смотреть на Rutube</span>
                                <span style="font-size: 18px;">→</span>
                            </a>
                        </div>
                    </div>
                `;
            } else {
                // Если не удалось получить embed URL
                html += `
                    <div class="video-item rutube-video" style="margin-bottom: 30px; padding: 30px; background: linear-gradient(135deg, #34A1F008 0%, #34A1F015 100%); border: 2px solid #34A1F030; border-radius: 24px; text-align: center;">
                        <div style="font-size: 64px; margin-bottom: 20px;">🎬</div>
                        <h3 style="margin: 0 0 15px 0; color: #1A1A1A; font-size: 24px; font-weight: 600;">${videoTitle}</h3>
                        ${videoAuthor ? `<p style="margin: 0 0 10px 0; color: #34A1F0; font-size: 18px;">${videoAuthor}</p>` : ''}
                        <p style="margin: 0 0 25px 0; color: #666;">Это видео доступно для просмотра только на Rutube</p>
                        <a href="${videoUrl}" target="_blank" 
                           style="display: inline-block; padding: 14px 32px; background: #34A1F0; color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">
                            Перейти к видео на Rutube →
                        </a>
                    </div>
                `;
            }
        }
    });
    
    if (!hasValidVideos) {
        html += `
            <div style="padding: 80px 20px; text-align: center; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 24px;">
                <p style="font-size: 64px; margin: 0 0 20px 0; opacity: 0.5;">🎬</p>
                <p style="font-size: 18px; color: #666;">Нет видео с Rutube для этой эмоции</p>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг упражнений
 */
function renderExercises(items) {
    let html = '<div class="exercises-list">';
    let hasExercises = false;
    
    items.forEach(item => {
        const text = item.description || '';
        if (!text) return;
        
        hasExercises = true;
        
        html += `
            <div class="exercise-item" style="margin-bottom: 25px; padding: 30px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="background: #4CAF50; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px; color: white;">🏋️</span>
                    </div>
                    <h3 style="margin: 0; color: #333; font-size: 24px; font-weight: 600;">${item.title}</h3>
                </div>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border-left: 4px solid #4CAF50;">
                    <div style="line-height: 1.8; color: #444; font-size: 16px; white-space: pre-wrap;">${text}</div>
                </div>
                
                <div style="margin-top: 15px;">
                    <span style="background: #4CAF5020; color: #4CAF50; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                        📋 Упражнение
                    </span>
                </div>
            </div>
        `;
    });
    
    return hasExercises ? html + '</div>' : '<div style="padding: 60px; text-align: center; color: #999;">📋 Нет упражнений</div>';
}

/**
 * Рендеринг статей
 */
function renderArticles(items) {
    let html = '<div class="articles-list">';
    let hasArticles = false;
    
    items.forEach(item => {
        const text = item.description || '';
        if (!text) return;
        
        hasArticles = true;
        
        html += `
            <div class="article-item" style="margin-bottom: 25px; padding: 30px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="background: #2196F3; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px; color: white;">💡</span>
                    </div>
                    <h3 style="margin: 0; color: #333; font-size: 24px; font-weight: 700;">${item.title}</h3>
                </div>
                
                <div style="background: #ffffff; padding: 20px; border-radius: 12px; border-left: 4px solid #2196F3; line-height: 1.8; color: #444; font-size: 16px; white-space: pre-wrap;">${text}</div>
                
                <div style="margin-top: 15px;">
                    <span style="background: #2196F320; color: #2196F3; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                        ✨ Совет
                    </span>
                </div>
            </div>
        `;
    });
    
    return hasArticles ? html + '</div>' : '<div style="padding: 60px; text-align: center; color: #999;">💡 Нет статей</div>';
}

function renderDefault(items) {
    return '<pre style="padding: 20px; background: #f5f5f5; border-radius: 8px; overflow: auto;">' + JSON.stringify(items, null, 2) + '</pre>';
}

function getEmptyStateHTML(tabId) {
    const messages = {
        'music': '🎵 Нет музыки',
        'video': '🎬 Нет видео',
        'images': '🖼️ Нет фотографий',
        'exercises': '📋 Нет упражнений',
        'articles': '💡 Нет статей'
    };
    
    return `<div style="padding: 80px 20px; text-align: center; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 24px; color: #999;">
        <p style="font-size: 64px; margin: 0 0 20px 0; opacity: 0.5;">${getIconForTab(tabId)}</p>
        <p style="font-size: 18px; margin: 0;">${messages[tabId] || 'Нет материалов'}</p>
    </div>`;
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
        backButton.className = 'back-to-main';
        backButton.innerHTML = '<span style="font-size: 20px;">←</span> <span>Вернуться на главную</span>';
        backButton.style.cssText = 'margin: 30px 0; padding: 12px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; font-weight: 600;';
        backButton.onclick = () => window.location.href = 'index.html';
        container.appendChild(backButton);
    }
}

// Добавляем базовые стили
const style = document.createElement('style');
style.textContent = `
    .image-item, .music-item, .video-item, .exercise-item, .article-item {
        transition: transform 0.3s, box-shadow 0.3s;
    }
    .image-item:hover, .music-item:hover, .video-item:hover, .exercise-item:hover, .article-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .tab-content-container {
        animation: fadeIn 0.3s ease-out;
    }
    audio {
        width: 100%;
        border-radius: 30px;
    }
    .back-to-main {
        transition: transform 0.3s, box-shadow 0.3s;
    }
    .back-to-main:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5) !important;
    }
`;
document.head.appendChild(style);