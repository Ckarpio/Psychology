// import { API_URL } from "./const/const.js";

// // Глобальная переменная для хранения материалов
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
        
//         if (!emotionsResponse.ok) {
//             throw new Error('Ошибка загрузки списка эмоций');
//         }
        
//         const emotions = await emotionsResponse.json();
//         const emotionData = emotions.find(em => em.code === emotionCode);
        
//         if (!emotionData) {
//             displayError('Эмоция не найдена');
//             return;
//         }

//         displayEmotionInfo(emotionData);
//         await loadRecommendationsFromDB(emotionCode);
//         initTabs();
        
//         // Добавляем кнопку возврата после загрузки контента
//         addBackButton();
        
//     } catch (error) {
//         console.error('Ошибка:', error);
//         displayError('Ошибка загрузки данных с сервера');
//     }
// });

// /**
//  * Функция для добавления кнопки возврата на главную
//  */
// function addBackButton() {
//     const container = document.querySelector('.container');
//     if (!container) return;
    
//     // Проверяем, есть ли уже кнопка
//     if (document.querySelector('.back-to-main')) return;
    
//     const backButton = document.createElement('button');
//     backButton.className = 'back-to-main';
//     backButton.innerHTML = `
//         <span style="font-size: 20px;">←</span>
//         <span>Вернуться на главную</span>
//     `;
//     backButton.style.cssText = `
//         display: inline-flex;
//         align-items: center;
//         gap: 10px;
//         margin: 30px 0 20px 0;
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
//         border: 1px solid rgba(255,255,255,0.2);
//     `;
    
//     // Добавляем эффекты при наведении
//     backButton.addEventListener('mouseover', () => {
//         backButton.style.transform = 'translateY(-3px)';
//         backButton.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
//     });
    
//     backButton.addEventListener('mouseout', () => {
//         backButton.style.transform = 'translateY(0)';
//         backButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
//     });
    
//     backButton.addEventListener('click', () => {
//         window.location.href = 'index.html';
//     });
    
//     container.appendChild(backButton);
// }

// /**
//  * Функция для загрузки и обработки фотографий
//  * @param {string} imageUrl - URL изображения
//  * @returns {Promise<string>} - обработанный URL или путь к изображению
//  */
// async function loadImage(imageUrl) {
//     if (!imageUrl) return null;
    
//     try {
//         // Если это уже полный URL, возвращаем как есть
//         if (imageUrl.startsWith('http')) {
//             return imageUrl;
//         }
        
//         // Если это относительный путь, добавляем базовый URL
//         const fullUrl = `${API_URL}${imageUrl}`;
        
//         // Проверяем, доступно ли изображение
//         const response = await fetch(fullUrl, { method: 'HEAD' });
//         if (response.ok) {
//             return fullUrl;
//         } else {
//             console.warn('Изображение не найдено:', fullUrl);
//             return null;
//         }
//     } catch (error) {
//         console.error('Ошибка загрузки изображения:', error);
//         return null;
//     }
// }

// /**
//  * Функция для предзагрузки нескольких изображений
//  * @param {Array} items - массив объектов с изображениями
//  * @returns {Promise<Array>} - массив объектов с загруженными изображениями
//  */
// async function preloadImages(items) {
//     if (!items || !Array.isArray(items)) return [];
    
//     const loadedItems = [];
    
//     for (const item of items) {
//         const imageUrl = item.url || item.src || item.path || item.image_url || item.imageUrl;
//         if (imageUrl) {
//             const loadedUrl = await loadImage(imageUrl);
//             if (loadedUrl) {
//                 loadedItems.push({
//                     ...item,
//                     loadedUrl: loadedUrl,
//                     originalUrl: imageUrl
//                 });
//             }
//         }
//     }
    
//     return loadedItems;
// }

// /**
//  * Функция для извлечения информации из ссылки VK
//  */
// function parseVKUrl(url) {
//     if (!url) return null;
    
//     // Проверяем, что это ссылка VK
//     if (!url.includes('vk.com') && !url.includes('vk.ru')) {
//         return null;
//     }
    
//     let trackInfo = {
//         title: 'Трек в VK Музыке',
//         artist: '',
//         type: 'track',
//         icon: '🎵',
//         color: '#0077FF'
//     };
    
//     // Пытаемся извлечь информацию из разных паттернов VK ссылок
    
//     // Паттерн: audio-20012345_12345678 (старый формат)
//     const audioMatch = url.match(/audio(-?\d+_\d+)/);
//     if (audioMatch) {
//         trackInfo.title = 'Аудиозапись VK';
//         trackInfo.artist = 'VK Music';
//         trackInfo.type = 'track';
//     }
    
//     // Паттерн: music/album/-20012345_12345678
//     const albumMatch = url.match(/album[\/-](-?\d+_\d+)/);
//     if (albumMatch) {
//         trackInfo.title = 'Альбом';
//         trackInfo.artist = 'VK Music';
//         trackInfo.type = 'album';
//         trackInfo.icon = '💿';
//     }
    
//     // Паттерн: music/playlist/-20012345_12345678
//     const playlistMatch = url.match(/playlist[\/-](-?\d+_\d+)/);
//     if (playlistMatch) {
//         trackInfo.title = 'Плейлист';
//         trackInfo.artist = 'VK Music';
//         trackInfo.type = 'playlist';
//         trackInfo.icon = '📀';
//     }
    
//     // Паттерн: artist/id
//     const artistMatch = url.match(/artist[\/-](\d+)/);
//     if (artistMatch) {
//         trackInfo.title = 'Страница артиста';
//         trackInfo.artist = 'VK Music';
//         trackInfo.type = 'artist';
//         trackInfo.icon = '👤';
//     }
    
//     // Пытаемся получить название из query параметров
//     try {
//         const urlObj = new URL(url);
//         const qParam = urlObj.searchParams.get('q');
//         if (qParam) {
//             trackInfo.title = qParam;
//             trackInfo.artist = 'Поиск VK';
//         }
//     } catch (e) {
//         // Игнорируем ошибки парсинга URL
//     }
    
//     return trackInfo;
// }

// /**
//  * Функция для определения типа ссылки VK
//  */
// function getVKLinkInfo(url) {
//     if (!url) return null;
    
//     // Проверяем, что это ссылка VK
//     if (!url.includes('vk.com') && !url.includes('vk.ru')) {
//         return null;
//     }
    
//     // Определяем тип контента
//     if (url.includes('/music') || url.includes('/audio')) {
//         if (url.includes('/playlist')) {
//             return {
//                 type: 'playlist',
//                 icon: '📀',
//                 title: 'Плейлист в VK Музыке',
//                 color: '#0077FF'
//             };
//         } else if (url.includes('/album')) {
//             return {
//                 type: 'album',
//                 icon: '💿',
//                 title: 'Альбом в VK Музыке',
//                 color: '#0077FF'
//             };
//         } else if (url.includes('/artist')) {
//             return {
//                 type: 'artist',
//                 icon: '👤',
//                 title: 'Артист в VK Музыке',
//                 color: '#0077FF'
//             };
//         } else {
//             return {
//                 type: 'track',
//                 icon: '🎵',
//                 title: 'Трек в VK Музыке',
//                 color: '#0077FF'
//             };
//         }
//     } else if (url.includes('/video')) {
//         return {
//             type: 'video',
//             icon: '🎬',
//             title: 'Видео в VK',
//             color: '#0077FF'
//         };
//     }
    
//     return {
//         type: 'vk',
//         icon: '🔗',
//         title: 'Ссылка VK',
//         color: '#0077FF'
//     };
// }

// /**
//  * Функция для получения embed URL Rutube
//  * @param {string} url - оригинальная ссылка на видео Rutube
//  * @returns {Object|null} информация для встраивания
//  */
// function getRutubeEmbedUrl(url) {
//     if (!url || !url.includes('rutube.ru')) return null;
    
//     console.log('Обрабатываем ссылку Rutube:', url);
    
//     // Паттерны для разных форматов ссылок Rutube
//     const patterns = [
//         // rutube.ru/video/8c350a831242aea13307af9ce3175aba/
//         { regex: /video\/([a-zA-Z0-9]+)/, type: 'video' },
//         // rutube.ru/play/embed/8c350a831242aea13307af9ce3175aba
//         { regex: /embed\/([a-zA-Z0-9]+)/, type: 'embed' },
//         // rutube.ru/?v=8c350a831242aea13307af9ce3175aba
//         { regex: /[?&]v=([a-zA-Z0-9]+)/, type: 'param' },
//         // rutube.ru/8c350a831242aea13307af9ce3175aba
//         { regex: /\/([a-zA-Z0-9]{32,})/, type: 'direct' }
//     ];
    
//     for (const pattern of patterns) {
//         const match = url.match(pattern.regex);
//         if (match) {
//             const videoId = match[1];
//             console.log('Найден ID видео Rutube:', videoId);
//             return {
//                 embedUrl: `https://rutube.ru/play/embed/${videoId}`,
//                 videoId: videoId,
//                 platform: 'rutube',
//                 name: 'Rutube',
//                 color: '#34A1F0',
//                 icon: '🎬',
//                 canEmbed: true
//             };
//         }
//     }
    
//     // Если не нашли по паттернам, но это Rutube
//     if (url.includes('rutube.ru')) {
//         console.warn('Не удалось извлечь ID из ссылки Rutube:', url);
//         return {
//             embedUrl: null,
//             videoId: null,
//             platform: 'rutube',
//             name: 'Rutube',
//             color: '#34A1F0',
//             icon: '🎬',
//             canEmbed: false
//         };
//     }
    
//     return null;
// }

// /**
//  * Загрузка рекомендаций из базы данных
//  */
// async function loadRecommendationsFromDB(emotionCode) {
//     try {
//         const response = await fetch(`${API_URL}/api/recommendation?emotion=${emotionCode}`);
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log('Данные из базы данных:', data);
        
//         if (data.materials) {
//             window.currentEmotionMaterials = data.materials;
//         } else if (data.material) {
//             window.currentEmotionMaterials = data.material;
//         } else if (data.music || data.video || data.images || data.exercises || data.articles) {
//             window.currentEmotionMaterials = data;
//         } else {
//             console.warn('Неизвестная структура данных:', data);
//             window.currentEmotionMaterials = detectMaterialsStructure(data);
//         }
        
//         console.log('Обработанные материалы из БД:', window.currentEmotionMaterials);
        
//     } catch (error) {
//         console.error('Ошибка при загрузке из базы данных:', error);
//         displayError('Не удалось загрузить материалы из базы данных');
//     }
// }

// /**
//  * Пытается определить структуру материалов из полученных данных
//  */
// function detectMaterialsStructure(data) {
//     const structured = {
//         music: [],
//         video: [],
//         images: [],
//         exercises: [],
//         articles: []
//     };
    
//     if (Array.isArray(data)) {
//         data.forEach(item => {
//             if (item.type && structured.hasOwnProperty(item.type)) {
//                 structured[item.type].push(item);
//             } else if (item.category) {
//                 const category = item.category.toLowerCase();
//                 if (structured.hasOwnProperty(category)) {
//                     structured[category].push(item);
//                 }
//             } else {
//                 // Определяем по URL
//                 if (item.url) {
//                     if (item.url.includes('rutube.ru')) {
//                         structured.video.push(item);
//                     } else if (item.url.includes('vk.com') || item.url.includes('vk.ru')) {
//                         if (item.url.includes('video')) {
//                             structured.video.push(item);
//                         } else {
//                             structured.music.push(item);
//                         }
//                     } else if (item.url.match(/\.(mp3|wav|ogg)$/i)) {
//                         structured.music.push(item);
//                     } else if (item.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
//                         structured.images.push(item);
//                     } else {
//                         structured.articles.push(item);
//                     }
//                 } else {
//                     structured.articles.push(item);
//                 }
//             }
//         });
//     } else {
//         return data;
//     }
    
//     return structured;
// }

// function displayEmotionInfo(emotionData) {
//     const titleElement = document.querySelector('h1');
//     const descriptionElement = document.querySelector('.info-box p');
    
//     if (!titleElement || !descriptionElement) {
//         console.error('Элементы для отображения информации не найдены');
//         return;
//     }
    
//     titleElement.textContent = emotionData.label || emotionData.name || 'Эмоция';
//     descriptionElement.textContent = emotionData.description || '';
   
//     const infoBox = document.querySelector('.info-box');
//     if (infoBox && emotionData.color) {
//         infoBox.style.borderLeftColor = emotionData.color;
//         infoBox.style.backgroundColor = `${emotionData.color}20`; 
//     }
    
//     if (emotionData.effect) {
//         document.body.classList.add(`emotion-${emotionData.effect}`);
//     }
    
//     addAdditionalInfo(emotionData);
// }

// function addAdditionalInfo(emotionData) {
//     let additionalInfoContainer = document.querySelector('.additional-emotion-info');
    
//     if (!additionalInfoContainer) {
//         additionalInfoContainer = document.createElement('div');
//         additionalInfoContainer.className = 'additional-emotion-info';
        
//         const infoBox = document.querySelector('.info-box');
//         if (infoBox && infoBox.parentNode) {
//             infoBox.parentNode.insertBefore(additionalInfoContainer, infoBox.nextSibling);
//         }
//     }
    
//     let additionalHtml = '';
    
//     if (emotionData.effect) {
//         additionalHtml += `<p><strong>Тип:</strong> ${emotionData.effect === 'positive' ? 'Позитивная' : 'Негативная'}</p>`;
//     }
    
//     additionalInfoContainer.innerHTML = additionalHtml;
// }

// function initTabs() {
//     const tabs = document.querySelectorAll('.tab');
    
//     if (tabs.length === 0) {
//         console.error('Вкладки не найдены');
//         return;
//     }
    
//     const container = document.querySelector('.container');
//     const tabsContainer = document.querySelector('.tabs');
    
//     let contentContainer = document.querySelector('.tab-content-container');
//     if (!contentContainer) {
//         contentContainer = document.createElement('div');
//         contentContainer.className = 'tab-content-container';
//         if (tabsContainer && container) {
//             container.insertBefore(contentContainer, tabsContainer.nextSibling);
//         }
//     }
    
//     tabs.forEach(tab => {
//         tab.addEventListener('click', function() {
//             tabs.forEach(t => t.classList.remove('active'));
//             this.classList.add('active');
            
//             const tabId = this.getAttribute('data-tab');
//             showTabContent(tabId, contentContainer);
//         });
//     });
    
//     const defaultTab = document.querySelector('.tab');
//     if (defaultTab) {
//         defaultTab.classList.add('active');
//         const defaultTabId = defaultTab.getAttribute('data-tab');
//         showTabContent(defaultTabId, contentContainer);
//     }
// }

// async function showTabContent(tabId, container) {
//     const materials = window.currentEmotionMaterials || {};
    
//     let items = [];
    
//     const tabMapping = {
//         'music': 'music',
//         'video': 'video',
//         'images': 'images',
//         'exercises': 'exercises',
//         'articles': 'articles'
//     };
    
//     const dataField = tabMapping[tabId];
//     items = materials[dataField] || [];
    
//     let html = `<h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">${getIconForTab(tabId)} ${getTitleForTab(tabId)}</h2>`;
    
//     if (items && items.length > 0) {
//         html += renderTabContent(tabId, items);
//     } else {
//         html += getEmptyStateHTML(tabId);
//     }
    
//     container.innerHTML = html;
// }

// function getIconForTab(tabId) {
//     const icons = {
//         'music': '🎵',
//         'video': '🎬',
//         'images': '🖼️',
//         'exercises': '📖',
//         'articles': '📄'
//     };
//     return icons[tabId] || '📁';
// }

// function getTitleForTab(tabId) {
//     const titles = {
//         'music': 'Музыка',
//         'video': 'Видео',
//         'images': 'Картинки',
//         'exercises': 'Упражнения',
//         'articles': 'Статьи'
//     };
//     return titles[tabId] || tabId;
// }

// function renderTabContent(tabId, items) {
//     switch(tabId) {
//         case 'images':
//             return renderImages(items);
//         case 'music':
//             return renderMusic(items);
//         case 'video':
//             return renderRutubeVideos(items);
//         case 'exercises':
//             return renderExercises(items);
//         case 'articles':
//             return renderArticles(items);
//         default:
//             return renderDefault(items);
//     }
// }

// /**
//  * Рендеринг изображений с поддержкой загрузки
//  */
// async function renderImages(items) {
//     let html = '<div class="images-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding: 20px 0;">';
    
//     // Предзагружаем изображения
//     const loadedItems = await preloadImages(items);
    
//     if (loadedItems.length === 0) {
//         return '<div class="empty-gallery" style="padding: 60px; text-align: center; color: #999;">🖼️ Нет доступных изображений</div>';
//     }
    
//     for (const item of loadedItems) {
//         const imageUrl = item.loadedUrl;
//         const title = item.title || item.name || 'Изображение';
//         const description = item.description || '';
        
//         html += `
//             <div class="image-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s ease; cursor: pointer;" 
//                  onclick="window.open('${imageUrl}', '_blank')"
//                  onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.15)';"
//                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';">
                
//                 <!-- Контейнер для изображения -->
//                 <div style="position: relative; width: 100%; height: 220px; background: #f5f5f5; overflow: hidden;">
//                     <img src="${imageUrl}" 
//                          alt="${title}" 
//                          style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;"
//                          onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;color:#999;\'><span style=\'font-size:48px;\'>🖼️</span><br>Ошибка загрузки</div>';"
//                          onload="this.style.opacity='1';">
//                 </div>
                
//                 <!-- Информация об изображении -->
//                 <div style="padding: 16px;">
//                     <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px; font-weight: 600; line-height: 1.3;">${title}</h4>
//                     ${description ? `<p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">${description}</p>` : ''}
                    
//                     <div style="margin-top: 12px;">
//                         <span style="background: #4CAF5020; color: #4CAF50; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
//                             🖼️ Изображение
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }
    
//     html += '</div>';
    
//     return html;
// }

// /**
//  * Рендеринг музыки с автоматическим извлечением информации из ссылки
//  */
// function renderMusic(items) {
//     let html = '<div class="music-list">';
    
//     items.forEach((item) => {
//         // Ищем URL в разных полях
//         const audioUrl = item.url || item.audio_url || item.audioUrl || item.file_url || item.fileUrl || item.link;
        
//         if (!audioUrl) {
//             console.warn('Нет URL для музыкального элемента:', item);
//             return;
//         }
        
//         // Пытаемся извлечь информацию из ссылки VK
//         const vkParsedInfo = parseVKUrl(audioUrl);
        
//         // Проверяем, является ли ссылка VK
//         const isVK = audioUrl.includes('vk.com') || audioUrl.includes('vk.ru');
        
//         // Для VK ссылок - красивая карточка с информацией из ссылки
//         if (isVK) {
//             const vkInfo = getVKLinkInfo(audioUrl);
            
//             // Используем информацию из парсинга ссылки
//             const trackTitle = vkParsedInfo?.title || 'Трек в VK Музыке';
//             const artist = vkParsedInfo?.artist || '';
            
//             html += `
//                 <div class="music-item vk-music" style="margin-bottom: 25px; padding: 30px; background: linear-gradient(135deg, #0077FF08 0%, #0077FF15 100%); border: 1px solid #0077FF30; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,119,255,0.1);">
//                     <div style="display: flex; align-items: center; gap: 25px; flex-wrap: wrap;">
//                         <!-- VK Иконка -->
//                         <div style="background: #0077FF; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,119,255,0.3);">
//                             <span style="font-size: 40px; color: white;">${vkInfo?.icon || '🎵'}</span>
//                         </div>
                        
//                         <!-- Информация о треке -->
//                         <div style="flex: 2; min-width: 300px;">
//                             <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
//                                 <span style="background: #0077FF20; color: #0077FF; padding: 5px 15px; border-radius: 30px; font-size: 14px; font-weight: 500;">
//                                     VK Музыка
//                                 </span>
//                                 <span style="color: #999; font-size: 14px;">
//                                     ${vkInfo?.type === 'playlist' ? 'Плейлист' : 
//                                       vkInfo?.type === 'album' ? 'Альбом' : 
//                                       vkInfo?.type === 'artist' ? 'Артист' : 'Трек'}
//                                 </span>
//                             </div>
                            
//                             <!-- Название трека -->
//                             <h3 style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 28px; font-weight: 700; line-height: 1.3;">
//                                 ${trackTitle}
//                             </h3>
                            
//                             <!-- Исполнитель (если удалось извлечь) -->
//                             ${artist ? `
//                                 <div style="margin: 0 0 20px 0; color: #0077FF; font-size: 22px; font-weight: 600;">
//                                     ${artist}
//                                 </div>
//                             ` : ''}
                          
                            
//                             <!-- Кнопка перехода в VK -->
//                             <a href="${audioUrl}" target="_blank" 
//                                style="display: inline-flex; align-items: center; justify-content: center; gap: 12px; 
//                                       background: #0077FF; 
//                                       color: white; 
//                                       text-decoration: none; 
//                                       padding: 16px 32px; 
//                                       border-radius: 50px; 
//                                       font-weight: 600; 
//                                       font-size: 16px;
//                                       letter-spacing: 0.5px;
//                                       transition: all 0.3s ease;
//                                       box-shadow: 0 8px 20px rgba(0,119,255,0.3);
//                                       border: 1px solid rgba(255,255,255,0.2);
//                                       width: fit-content;"
//                                onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 15px 30px rgba(0,119,255,0.4)'; this.style.background='#0066DD';"
//                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(0,119,255,0.3)'; this.style.background='#0077FF';">
//                                 <span style="font-size: 24px;">🎧</span>
//                                 <span>Слушать в VK Музыке</span>
//                                 <span style="font-size: 20px;">→</span>
//                             </a>
                            
//                             <!-- Дополнительная информация -->
//                             <div style="margin-top: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
//                                 <span style="color: #999; font-size: 13px; display: flex; align-items: center; gap: 5px;">
//                                     <span style="color: #0077FF;">●</span> Требуется авторизация VK
//                                 </span>
//                                 <span style="color: #999; font-size: 13px; display: flex; align-items: center; gap: 5px;">
//                                     <span style="color: #0077FF;">●</span> Доступно в приложении VK
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             `;
//         } 
//         // Для локальных аудиофайлов
//         else if (audioUrl.match(/\.(mp3|wav|ogg|m4a)$/i)) {
//             const fullAudioUrl = audioUrl.startsWith('http') ? audioUrl : `${API_URL}${audioUrl}`;
//             html += `
//                 <div class="music-item" style="margin-bottom: 20px; padding: 25px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
//                     <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
//                         <div style="font-size: 48px; background: #4CAF5020; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">🎵</div>
//                         <div style="flex: 1; min-width: 250px;">
//                             <h3 style="margin: 0 0 8px 0; color: #333; font-size: 24px; font-weight: 600;">${item.title || 'Аудиозапись'}</h3>
//                             ${item.artist ? `<div style="margin: 0 0 12px 0; color: #4CAF50; font-size: 18px; font-weight: 500;">${item.artist}</div>` : ''}
//                             <audio controls style="width: 100%; margin-top: 10px;">
//                                 <source src="${fullAudioUrl}" type="audio/mpeg">
//                                 Ваш браузер не поддерживает аудио элемент.
//                             </audio>
//                         </div>
//                     </div>
//                 </div>
//             `;
//         }
//         // Для других внешних ссылок
//         else {
//             html += `
//                 <div class="music-item external-service" style="margin-bottom: 20px; padding: 25px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 16px;">
//                     <div style="display: flex; align-items: center; gap: 20px;">
//                         <div style="font-size: 48px;">🔗</div>
//                         <div style="flex: 1;">
//                             <h3 style="margin: 0 0 8px 0; color: #333; font-size: 24px; font-weight: 600;">${item.title || 'Внешний ресурс'}</h3>
//                             ${item.artist ? `<div style="margin: 0 0 12px 0; color: #6c757d; font-size: 18px;">${item.artist}</div>` : ''}
//                             ${item.description ? `<p style="margin: 0 0 15px 0; color: #666;">${item.description}</p>` : ''}
//                             <a href="${audioUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #6c757d; color: white; text-decoration: none; border-radius: 30px; font-weight: 500;">
//                                 Перейти к источнику →
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             `;
//         }
//     });
    
//     html += '</div>';
//     return html;
// }

// /**
//  * Рендеринг видео только с Rutube
//  */
// function renderRutubeVideos(items) {
//     let html = '<div class="video-list rutube-videos">';
//     let hasValidVideos = false;
    
//     items.forEach((item) => {
//         const videoUrl = item.url || item.video_url || item.videoUrl || item.embed_url || item.embedUrl;
        
//         if (!videoUrl) {
//             console.warn('Нет URL для видео элемента:', item);
//             return;
//         }
        
//         // Получаем информацию о видео Rutube
//         const rutubeInfo = getRutubeEmbedUrl(videoUrl);
        
//         // Показываем только видео с Rutube
//         if (rutubeInfo) {
//             hasValidVideos = true;
            
//             // Получаем название видео и автора
//             const videoTitle = item.title || item.name || 'Видео на Rutube';
//             const videoAuthor = item.author || item.artist || item.channel || 'Rutube';
            
//             // Если есть embed URL - показываем плеер
//             if (rutubeInfo.canEmbed && rutubeInfo.embedUrl) {
//                 html += `
//                     <div class="video-item rutube-video" style="margin-bottom: 40px; padding: 25px; background: linear-gradient(135deg, #34A1F008 0%, #34A1F015 100%); border: 2px solid #34A1F030; border-radius: 24px; box-shadow: 0 15px 30px rgba(52,161,240,0.15);">
//                         <!-- Заголовок видео -->
//                         <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #34A1F030;">
//                             <div style="background: #34A1F0; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 15px rgba(52,161,240,0.3);">
//                                 <span style="font-size: 30px; color: white;">🎬</span>
//                             </div>
//                             <div style="flex: 1;">
//                                 <h3 style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 26px; font-weight: 700; line-height: 1.3;">${videoTitle}</h3>
//                                 <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
//                                     <span style="color: #34A1F0; font-size: 18px; font-weight: 500;">${videoAuthor}</span>
//                                     <span style="background: #34A1F020; color: #34A1F0; padding: 4px 12px; border-radius: 30px; font-size: 13px; font-weight: 500;">
//                                         Rutube
//                                     </span>
//                                 </div>
//                                 ${item.description ? `<p style="margin: 15px 0 0 0; color: #666; line-height: 1.6;">${item.description}</p>` : ''}
//                             </div>
//                         </div>
                        
//                         <!-- Rutube плеер -->
//                         <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; margin-bottom: 20px; background: #000; box-shadow: 0 10px 25px rgba(52,161,240,0.3);">
//                             <iframe 
//                                 src="${rutubeInfo.embedUrl}" 
//                                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 16px;"
//                                 frameborder="0"
//                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                                 allowfullscreen>
//                             </iframe>
//                         </div>
                        
//                         <!-- Информация и ссылки -->
//                         <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; padding: 0 10px;">
//                             <div style="display: flex; gap: 15px; align-items: center;">
//                                 <span style="color: #34A1F0; font-size: 14px;">
//                                     📊 ID: ${rutubeInfo.videoId || 'загрузка...'}
//                                 </span>
//                                 <span style="color: #999; font-size: 14px;">
//                                     ⏱️ Длительность: загрузка...
//                                 </span>
//                             </div>
//                             <a href="${videoUrl}" target="_blank" 
//                                style="display: inline-flex; align-items: center; gap: 8px; background: #34A1F0; color: white; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 15px; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(52,161,240,0.3);"
//                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 18px rgba(52,161,240,0.4)'; this.style.background='#2A8CD0';"
//                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(52,161,240,0.3)'; this.style.background='#34A1F0';">
//                                 <span>Смотреть на Rutube</span>
//                                 <span style="font-size: 18px;">→</span>
//                             </a>
//                         </div>
//                     </div>
//                 `;
//             } else {
//                 // Если не удалось получить embed URL
//                 html += `
//                     <div class="video-item rutube-video" style="margin-bottom: 30px; padding: 30px; background: linear-gradient(135deg, #34A1F008 0%, #34A1F015 100%); border: 2px solid #34A1F030; border-radius: 24px; text-align: center;">
//                         <div style="font-size: 64px; margin-bottom: 20px;">🎬</div>
//                         <h3 style="margin: 0 0 15px 0; color: #1A1A1A; font-size: 24px; font-weight: 600;">${videoTitle}</h3>
//                         <p style="margin: 0 0 25px 0; color: #666;">Это видео доступно для просмотра только на Rutube</p>
//                         <a href="${videoUrl}" target="_blank" 
//                            style="display: inline-block; padding: 14px 32px; background: #34A1F0; color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">
//                             Перейти к видео на Rutube →
//                         </a>
//                     </div>
//                 `;
//             }
//         }
//     });
    
//     if (!hasValidVideos) {
//         html += `
//             <div style="padding: 80px 20px; text-align: center; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 24px;">
//                 <p style="font-size: 64px; margin: 0 0 20px 0; opacity: 0.5;">🎬</p>
//                 <p style="font-size: 18px; color: #666;">Нет видео с Rutube для этой эмоции</p>
//             </div>
//         `;
//     }
    
//     html += '</div>';
//     return html;
// }

// function renderExercises(items) {
//     let html = '<div class="exercises-list">';
    
//     items.forEach((item) => {
//         html += `
//             <div class="exercise-item" style="margin-bottom: 20px; padding: 25px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
//                 <h3 style="margin: 0 0 10px 0; color: #333; font-size: 24px; font-weight: 600;">${item.title || item.name || 'Упражнение'}</h3>
//                 ${item.subtitle ? `<div style="margin: 0 0 10px 0; color: #666; font-weight: 500;">${item.subtitle}</div>` : ''}
//                 ${item.description ? `<p style="margin: 0 0 15px 0; color: #555;">${item.description}</p>` : ''}
                
//                 ${item.body || item.instructions || item.text || item.content ? `
//                     <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-top: 15px;">
//                         <pre style="margin: 0; white-space: pre-wrap; font-family: inherit; color: #333; line-height: 1.6;">${item.body || item.instructions || item.text || item.content}</pre>
//                     </div>
//                 ` : ''}
//             </div>
//         `;
//     });
    
//     html += '</div>';
//     return html;
// }

// function renderArticles(items) {
//     let html = '<div class="articles-list">';
    
//     items.forEach((item) => {
//         const content = item.displayContent || item.text || item.body || item.content || item.description;
        
//         html += `
//             <div class="article-item" style="margin-bottom: 25px; padding: 30px; background: white; border: 1px solid #e0e0e0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
//                 <h3 style="margin: 0 0 15px 0; color: #333; font-size: 28px; font-weight: 700; border-bottom: 2px solid #4CAF50; padding-bottom: 12px;">${item.title || item.name || 'Статья'}</h3>
//                 ${item.author ? `<div style="margin: 0 0 15px 0; color: #666; font-style: italic; font-size: 16px;">Автор: ${item.author}</div>` : ''}
                
//                 <div style="line-height: 1.8; color: #444; font-size: 16px;">
//                     ${content ? content.split('\n').map(paragraph => 
//                         paragraph.trim() ? `<p style="margin-bottom: 20px;">${paragraph}</p>` : ''
//                     ).join('') : '<p style="color: #999;">Содержание не доступно</p>'}
//                 </div>
                
//                 ${item.external_url || item.link || item.url ? `
//                     <a href="${item.external_url || item.link || item.url}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 30px; font-weight: 500;">
//                         Читать полностью →
//                     </a>
//                 ` : ''}
//             </div>
//         `;
//     });
    
//     html += '</div>';
//     return html;
// }

// function renderDefault(items) {
//     let html = '<div class="default-list">';
    
//     items.forEach((item) => {
//         html += `
//             <div class="default-item" style="margin-bottom: 15px; padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px;">
//                 <pre style="margin: 0; white-space: pre-wrap; font-size: 14px;">${JSON.stringify(item, null, 2)}</pre>
//             </div>
//         `;
//     });
    
//     html += '</div>';
//     return html;
// }

// function getEmptyStateHTML(tabId) {
//     const messages = {
//         'music': '🎵 В базе данных нет музыкальных материалов для этой эмоции',
//         'video': '🎬 В базе данных нет видео с Rutube для этой эмоции',
//         'images': '🖼️ В базе данных нет изображений для этой эмоции',
//         'exercises': '📖 В базе данных нет упражнений для этой эмоции',
//         'articles': '📄 В базе данных нет статей для этой эмоции'
//     };
    
//     return `
//         <div style="padding: 80px 20px; text-align: center; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 24px; color: #999;">
//             <p style="font-size: 80px; margin: 0 0 25px 0; opacity: 0.5;">${getIconForTab(tabId)}</p>
//             <p style="font-size: 18px; font-style: italic; margin: 0; color: #666;">${messages[tabId] || 'Нет доступных материалов в базе данных'}</p>
//         </div>
//     `;
// }

// function displayError(message) {
//     const titleElement = document.querySelector('h1');
//     const descriptionElement = document.querySelector('.info-box p');
    
//     if (titleElement) {
//         titleElement.textContent = 'Ошибка';
//     }
    
//     if (descriptionElement) {
//         descriptionElement.textContent = message;
//     }
    
//     const tabs = document.querySelector('.tabs');
//     if (tabs) {
//         tabs.style.display = 'none';
//     }
    
//     const container = document.querySelector('.container');
//     if (container) {
//         const backButton = document.createElement('button');
//         backButton.className = 'back-to-main';
//         backButton.innerHTML = `
//             <span style="font-size: 20px;">←</span>
//             <span>Вернуться на главную</span>
//         `;
//         backButton.style.cssText = `
//             display: inline-flex;
//             align-items: center;
//             gap: 10px;
//             margin: 30px 0 20px 0;
//             padding: 12px 28px;
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             border: none;
//             border-radius: 50px;
//             font-size: 16px;
//             font-weight: 600;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
//         `;
        
//         backButton.addEventListener('mouseover', () => {
//             backButton.style.transform = 'translateY(-3px)';
//             backButton.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
//         });
        
//         backButton.addEventListener('mouseout', () => {
//             backButton.style.transform = 'translateY(0)';
//             backButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
//         });
        
//         backButton.addEventListener('click', () => {
//             window.location.href = 'index.html';
//         });
        
//         container.appendChild(backButton);
//     }
// }

// // Добавляем CSS
// const style = document.createElement('style');
// style.textContent = `
//     .image-item:hover, .music-item:hover, .exercise-item:hover, .article-item:hover {
//         transform: translateY(-3px);
//         box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
//         transition: all 0.3s ease;
//     }
    
//     @keyframes fadeIn {
//         from { opacity: 0; transform: translateY(15px); }
//         to { opacity: 1; transform: translateY(0); }
//     }
    
//     .tab-content-container {
//         animation: fadeIn 0.4s ease-out;
//     }
    
//     .vk-music {
//         transition: all 0.3s ease;
//     }
    
//     .vk-music:hover {
//         transform: translateY(-3px);
//         box-shadow: 0 20px 35px rgba(0,119,255,0.15) !important;
//     }
    
//     .rutube-video {
//         transition: all 0.3s ease;
//     }
    
//     .rutube-video:hover {
//         transform: translateY(-3px);
//         box-shadow: 0 25px 40px rgba(52,161,240,0.2) !important;
//     }
    
//     audio {
//         width: 100%;
//         border-radius: 40px;
//         height: 50px;
//     }
    
//     audio::-webkit-media-controls-panel {
//         background-color: #f0f0f0;
//     }
    
//     .back-to-main {
//         animation: fadeIn 0.5s ease-out;
//     }
    
//     .rutube-videos iframe {
//         transition: opacity 0.3s;
//     }
    
//     .rutube-videos iframe:hover {
//         opacity: 0.95;
//     }
// `;
// document.head.appendChild(style);
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
    
    const audioMatch = url.match(/audio(-?\d+_\d+)/);
    if (audioMatch) {
        trackInfo.title = 'Аудиозапись VK';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'track';
    }
    
    const albumMatch = url.match(/album[\/-](-?\d+_\d+)/);
    if (albumMatch) {
        trackInfo.title = 'Альбом';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'album';
        trackInfo.icon = '💿';
    }
    
    const playlistMatch = url.match(/playlist[\/-](-?\d+_\d+)/);
    if (playlistMatch) {
        trackInfo.title = 'Плейлист';
        trackInfo.artist = 'VK Music';
        trackInfo.type = 'playlist';
        trackInfo.icon = '📀';
    }
    
    return trackInfo;
}

/**
 * Функция для определения типа ссылки VK
 */
function getVKLinkInfo(url) {
    if (!url) return null;
    
    if (!url.includes('vk.com') && !url.includes('vk.ru')) {
        return null;
    }
    
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
        { regex: /[?&]v=([a-zA-Z0-9]+)/, type: 'param' }
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

/**
 * Функция для извлечения ID изображения из ссылки Pinterest
 */
function extractPinterestImageUrl(url) {
    if (!url) return null;
    
    if (url.includes('i.pinimg.com') && (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg'))) {
        return url;
    }
    
    const pinMatch = url.match(/pinterest\.com\/pin\/(\d+)/i) || url.match(/pin\/(\d+)/i);
    if (pinMatch) {
        const pinId = pinMatch[1];
        const folder = Math.abs(parseInt(pinId) % 1000).toString().padStart(3, '0');
        return `https://i.pinimg.com/originals/${folder}/${pinId}.jpg`;
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
                    description: item.description || '',
                    url: item.url || '',
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
        'exercises': '🏋️',
        'articles': '📄'
    };
    return icons[tabId] || '📁';
}

function getTitleForTab(tabId) {
    const titles = {
        'music': 'Музыка',
        'video': 'Видео',
        'images': 'Фотографии',
        'exercises': 'Упражнения',
        'articles': 'Статьи'
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
            return renderRutubeVideos(items, 'video');
        case 'exercises':
            return renderRutubeVideos(items, 'exercise');
        case 'articles':
            return renderArticles(items);
        default:
            return renderDefault(items);
    }
}

/**
 * Рендеринг изображений
 */
async function renderImages(items) {
    let html = '<div class="images-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; padding: 20px 0;">';
    let hasImages = false;
    
    for (const item of items) {
        const originalUrl = item.url || '';
        if (!originalUrl) continue;
        
        const imageUrl = extractPinterestImageUrl(originalUrl);
        hasImages = true;
        
        const isPinterest = imageUrl.includes('i.pinimg.com');
        
        html += `
            <div class="image-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); cursor: pointer;" 
                 onclick="window.open('${imageUrl}', '_blank')"
                 onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.15)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';">
                
                <div style="position: relative; width: 100%; height: 220px; background: #f5f5f5;">
                    <img src="${imageUrl}" 
                         alt="${item.title}" 
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;color:#999;\'>🖼️ Фото не доступно</div>';">
                </div>
                
                <div style="padding: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">${item.title}</h4>
                    ${item.description ? `<p style="margin: 0; color: #666; font-size: 14px;">${item.description}</p>` : ''}
                    <div style="margin-top: 12px;">
                        <span style="background: #4CAF5020; color: #4CAF50; padding: 4px 12px; border-radius: 20px; font-size: 12px;">🖼️ Фото</span>
                        ${isPinterest ? `<span style="background: #E6002320; color: #E60023; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-left: 8px;">📌 Pinterest</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    return hasImages ? html + '</div>' : '<div style="padding: 60px; text-align: center; color: #999;">🖼️ Нет фотографий</div>';
}

/**
 * Рендеринг музыки (VK)
 */
function renderMusic(items) {
    let html = '<div class="music-list">';
    let hasMusic = false;
    
    items.forEach(item => {
        const audioUrl = item.url || '';
        if (!audioUrl || !audioUrl.includes('vk.com')) return;
        
        hasMusic = true;
        
        const vkParsedInfo = parseVKUrl(audioUrl);
        const vkInfo = getVKLinkInfo(audioUrl);
        const trackTitle = vkParsedInfo?.title || item.title || 'Трек в VK Музыке';
        const artist = vkParsedInfo?.artist || '';
        
        html += `
            <div class="music-item vk-music" style="margin-bottom: 25px; padding: 30px; background: linear-gradient(135deg, #0077FF08 0%, #0077FF15 100%); border: 1px solid #0077FF30; border-radius: 24px;">
                <div style="display: flex; align-items: center; gap: 25px; flex-wrap: wrap;">
                    <div style="background: #0077FF; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 40px; color: white;">🎵</span>
                    </div>
                    
                    <div style="flex: 1;">
                        <span style="background: #0077FF20; color: #0077FF; padding: 5px 15px; border-radius: 30px; font-size: 14px; display: inline-block; margin-bottom: 10px;">
                            ${vkInfo?.type === 'playlist' ? 'Плейлист' : 'Трек'} в VK
                        </span>
                        
                        <h3 style="margin: 0 0 5px 0; color: #1A1A1A; font-size: 24px;">${trackTitle}</h3>
                        ${artist ? `<div style="margin: 0 0 15px 0; color: #0077FF; font-size: 18px;">${artist}</div>` : ''}
                        ${item.description ? `<p style="margin: 0 0 20px 0; color: #666;">${item.description}</p>` : ''}
                        
                        <a href="${audioUrl}" target="_blank" 
                           style="display: inline-flex; align-items: center; gap: 10px; background: #0077FF; color: white; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: 500;">
                            <span>Слушать в VK</span> <span>→</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    return hasMusic ? html + '</div>' : '<div style="padding: 60px; text-align: center; color: #999;">🎵 Нет музыки</div>';
}

/**
 * УНИВЕРСАЛЬНАЯ ФУНКЦИЯ: Рендеринг видео Rutube (и для видео, и для упражнений)
 */
function renderRutubeVideos(items, type = 'video') {
    let html = `<div class="video-list ${type}-videos">`;
    let hasValidVideos = false;
    
    const isExercise = type === 'exercise';
    const bgColor = isExercise ? '#4CAF50' : '#34A1F0';
    const icon = isExercise ? '🏋️' : '🎬';
    const label = isExercise ? 'Упражнение' : 'Rutube';
    const buttonText = isExercise ? 'Смотреть упражнение' : 'Смотреть на Rutube';
    const emptyIcon = isExercise ? '🏋️' : '🎬';
    const emptyMessage = isExercise ? 'Нет видео-упражнений для этой эмоции' : 'Нет видео для этой эмоции';
    
    items.forEach(item => {
        const videoUrl = item.url || '';
        if (!videoUrl) return;
        
        const rutubeInfo = getRutubeEmbedUrl(videoUrl);
        
        if (rutubeInfo && rutubeInfo.canEmbed) {
            hasValidVideos = true;
            
            const itemTitle = item.title || (isExercise ? 'Упражнение' : 'Видео');
            
            html += `
                <div class="video-item" style="margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, ${bgColor}08 0%, ${bgColor}15 100%); border: 2px solid ${bgColor}30; border-radius: 16px;">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <div style="background: ${bgColor}; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 24px; color: white;">${icon}</span>
                        </div>
                        <div>
                            <h3 style="margin: 0; color: #1A1A1A; font-size: 20px;">${itemTitle}</h3>
                            <span style="color: ${bgColor}; font-size: 14px;">${label}</span>
                        </div>
                    </div>
                    
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin-bottom: 15px;">
                        <iframe src="${rutubeInfo.embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                    </div>
                    
                    ${item.description ? `<p style="margin: 0 0 15px 0; color: #666;">${item.description}</p>` : ''}
                    
                    <a href="${videoUrl}" target="_blank" 
                       style="display: inline-flex; align-items: center; gap: 8px; background: ${bgColor}; color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; font-weight: 500;">
                        <span>${buttonText}</span> <span>→</span>
                    </a>
                </div>
            `;
        }
    });
    
    if (!hasValidVideos) {
        html += `<div style="padding: 60px; text-align: center; color: #999;">${emptyIcon} ${emptyMessage}</div>`;
    }
    
    html += '</div>';
    return html;
}

/**
 * Рендеринг статей (простой текст)
 */
function renderArticles(items) {
    let html = '<div class="articles-list">';
    let hasArticles = false;
    
    items.forEach(item => {
        const articleText = item.description || '';
        const title = item.title || 'Статья';
        
        if (!articleText) return;
        
        hasArticles = true;
        
        html += `
            <div class="article-item" style="margin-bottom: 20px; padding: 25px; background: white; border: 1px solid #e0e0e0; border-radius: 16px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="background: #FF9800; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 20px; color: white;">📄</span>
                    </div>
                    <h3 style="margin: 0; color: #333; font-size: 20px;">${title}</h3>
                </div>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; line-height: 1.6; color: #444; white-space: pre-wrap;">${articleText}</div>
            </div>
        `;
    });
    
    return hasArticles ? html + '</div>' : '<div style="padding: 60px; text-align: center; color: #999;">📄 Нет статей</div>';
}

function renderDefault(items) {
    return '<pre style="padding: 20px; background: #f5f5f5; border-radius: 8px;">' + JSON.stringify(items, null, 2) + '</pre>';
}

function getEmptyStateHTML(tabId) {
    const messages = {
        'music': '🎵 Нет музыки',
        'video': '🎬 Нет видео',
        'images': '🖼️ Нет фотографий',
        'exercises': '🏋️ Нет упражнений',
        'articles': '📄 Нет статей'
    };
    
    return `<div style="padding: 60px; text-align: center; color: #999;">${messages[tabId]}</div>`;
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
        backButton.innerHTML = '<span>←</span> Вернуться на главную';
        backButton.style.cssText = 'margin: 30px 0; padding: 12px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 50px; cursor: pointer;';
        backButton.onclick = () => window.location.href = 'index.html';
        container.appendChild(backButton);
    }
}

// Добавляем CSS
const style = document.createElement('style');
style.textContent = `
    .image-item, .music-item, .video-item, .article-item {
        transition: transform 0.3s, box-shadow 0.3s;
    }
    .image-item:hover, .music-item:hover, .video-item:hover, .article-item:hover {
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
`;
document.head.appendChild(style);