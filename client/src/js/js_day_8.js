
import { emotion } from "./const/emotion.js";
import{emotionsProperties} from "./const/emotionProperties.js"

const API_URL = 'http://localhost:3000';
let allEmotions = [];

async function loadEmotionsFromServer() {
    try {
        const response = await fetch(`${API_URL}/api/emotions`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки эмоций');
        }
        allEmotions = await response.json();
        return allEmotions;
    } catch (error) {
        console.error('Ошибка загрузки с сервера:', error);
        
        console.log('Используем локальные данные emotion');
        return emotion;
    }
}


let currentTab = 'positive';
let selectedEmotion = null;
let emotionsData = emotion; 

function createEmotionElement(emotionData) {
   const emotionsBtn = document.createElement("button");
   emotionsBtn.textContent = emotionData.label;
   emotionsBtn.className = "emotion";
   emotionsBtn.style.backgroundColor = emotionData.color;
   emotionsBtn.dataset.code = emotionData.code;
   emotionsBtn.dataset.effect = emotionData.effect;
   
  
   if (emotionData.effect === 'positive') {
       emotionsBtn.classList.add('emotion-positive');
   } else {
       emotionsBtn.classList.add('emotion-negative');
   }
   
   emotionsBtn.addEventListener('click', function() {

        fetch(`${API_URL}/api/emotions/${emotionData.code}/materials`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Сервер недоступен');
            })
            .then(properties => {
                localStorage.setItem(emotionData.code, JSON.stringify(properties));
                window.location.href = `second_index?emotion=${emotionData.code}`;
            })
            .catch(error => {
                console.log('Используем локальные данные');
                const properties = emotionsProperties.find((settings) => settings.code === emotionData.code);
                if(properties) {
                    localStorage.setItem(emotionData.code, JSON.stringify(properties));
                }
                window.location.href = `second_index?emotion=${emotionData.code}`;
            });
     
   });
    
   return emotionsBtn;
}

function renderEmotions(tab) {
    const emotionsContainer = document.getElementById("emoCont");

    if (!emotionsContainer) {
        console.error('Container Not Found');
        return;
    }

    emotionsContainer.innerHTML = '';
    

    const dataToUse = allEmotions.length > 0 ? allEmotions : emotionsData;
    const filteredEmotions = dataToUse.filter(em => em.effect === tab);

    
    if (filteredEmotions.length === 0) {
        console.error('Emotions Not Found for tab:', tab);
        return;
    }
    
    filteredEmotions.forEach(element => {
        const domElement = createEmotionElement(element);
        
        if (selectedEmotion && selectedEmotion.code === element.code) {
            domElement.classList.add('selected');
        }
        
        emotionsContainer.appendChild(domElement);
    });
}

function updateTabButtons(tab) {
    const selectBtnP = document.getElementById("selectBtnP");
    const selectBtnN = document.getElementById("selectBtnN");
    
    if (selectBtnP) selectBtnP.classList.remove('active');
    if (selectBtnN) selectBtnN.classList.remove('active');
    
    if (tab === 'positive' && selectBtnP) {
        selectBtnP.classList.add('active');
    } else if (tab === 'negative' && selectBtnN) {
        selectBtnN.classList.add('active');
    }
}

function handleTabClick(event) {
    const tab = event.currentTarget.dataset.tab;
    currentTab = tab;
    updateTabButtons(currentTab);
    renderEmotions(currentTab);
}

async function main() {
    updateTabButtons(currentTab);
    
    const serverData = await loadEmotionsFromServer();
    if (serverData && serverData.length > 0) {
        allEmotions = serverData;
        console.log('Данные загружены с сервера');
    }
    
    renderEmotions(currentTab);
    
    const selectBtnP = document.getElementById("selectBtnP");
    const selectBtnN = document.getElementById("selectBtnN");
    
    if (selectBtnP) {
        selectBtnP.addEventListener("click", handleTabClick);
    }
    
    if (selectBtnN) {
        selectBtnN.addEventListener("click", handleTabClick);
    }
}


document.addEventListener('DOMContentLoaded', main);