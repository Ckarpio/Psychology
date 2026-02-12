

// import { emotion } from "./const/emotion.js";

// let currentTab = 'positive';
// let selectedEmotion = null;
// let emotionsData = emotion;

// function createEmotionElement(emotionData) {
//    const emotionsBtn = document.createElement("button");
//    emotionsBtn.textContent = emotionData.label;
//    emotionsBtn.className = "emotion";
//    emotionsBtn.style.backgroundColor = emotionData.color;
//    emotionsBtn.dataset.code = emotionData.code;
//    emotionsBtn.dataset.effect = emotionData.effect;
   
  
//    if (emotionData.effect === 'positive') {
//        emotionsBtn.classList.add('emotion-positive');
//    } else {
//        emotionsBtn.classList.add('emotion-negative');
//    }
   
  
//    emotionsBtn.addEventListener('click', function() {
//        selectEmotion(emotionData);
//        window.location=""
//    });
   
//    return emotionsBtn;
// }


// function renderEmotions(tab) {
//     const emotionsContainer = document.getElementById("emoCont");

//     if (!emotionsContainer) {
//         console.error('Container Not Found');
//         return;
//     }

    
//     emotionsContainer.innerHTML = '';
    
   
//     const filteredEmotions = emotionsData.filter(em => em.effect === tab);
    
//     if (filteredEmotions.length === 0) {
//         console.error('Emotions Not Found for tab:', tab);
//         return;
//     }
    
    
//     filteredEmotions.forEach(element => {
//         const domElement = createEmotionElement(element);
        

//         if (selectedEmotion && selectedEmotion.code === element.code) {
//             domElement.classList.add('selected');
//         }
        
//         emotionsContainer.appendChild(domElement);
//     });
// }


// function updateTabButtons(tab) {
//     const selectBtnP = document.getElementById("selectBtnP");
//     const selectBtnN = document.getElementById("selectBtnN");
    
   
//     if (selectBtnP) selectBtnP.classList.remove('active');
//     if (selectBtnN) selectBtnN.classList.remove('active');
    
//     if (tab === 'positive' && selectBtnP) {
//         selectBtnP.classList.add('active');
//     } else if (tab === 'negative' && selectBtnN) {
//         selectBtnN.classList.add('active');
//     }
// }


// function handleTabClick(event) {
//     const tab = event.currentTarget.dataset.tab;
    
    
//     currentTab = tab;
    
//     updateTabButtons(currentTab);
    
    
//     renderEmotions(currentTab);
// }


// function main() {
   
//     updateTabButtons(currentTab);
   
//     renderEmotions(currentTab);
    
   
//     const selectBtnP = document.getElementById("selectBtnP");
//     const selectBtnN = document.getElementById("selectBtnN");
    
//     if (selectBtnP) {
//         selectBtnP.addEventListener("click", handleTabClick);
//     }
    
//     if (selectBtnN) {
//         selectBtnN.addEventListener("click", handleTabClick);
//     }
// }




// document.addEventListener('DOMContentLoaded', main);



import { emotion } from "./const/emotion.js";

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
       
    
       window.location.href = "secon_index.html?emotion=${emothionCode}";
       
   
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
    
   
    const filteredEmotions = emotionsData.filter(em => em.effect === tab);
    
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


function main() {
   
    updateTabButtons(currentTab);
   
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