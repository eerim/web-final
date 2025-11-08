const BASE_IMG_PATH = '/web-final/simulator-quiz/images/simulator/';
const DELAY = 4000; 
let currentIndex = 0; 
let currentKey = ''; 

const SCNRS = {
    "thumbsUp_ME": { 
        name: "Thumbs Up in the Middle East",
        states: [ 
            { 
                text: "Tourist takes a photo for a local, then gives a Thumbs Up (👍) to say 'Perfect!'",
                b1: { img: BASE_IMG_PATH + "thumbsup/c1p1.webp", cap: "Nice shot!" },
                b2: { img: BASE_IMG_PATH + "thumbsup/c2p1.webp", cap: "Ready!" }, 
                b3: { img: BASE_IMG_PATH + "thumbsup/c3p1.webp", cap: "Perfect!" } 
            },
            { 
                text: "The local immediately reacts with surprise and offense!",
                b1: { img: BASE_IMG_PATH + "thumbsup/c1p2.webp", cap: "UP YOURS!" },
                b2: { img: BASE_IMG_PATH + "thumbsup/c2p2.webp", cap: "INSULTED!" }, 
                b3: { img: BASE_IMG_PATH + "thumbsup/c3p2.webp", cap: "NO!!" } ,
                finalMessage: "<strong>Cultural Lesson:</strong> The Thumbs Up (👍) gesture is considered highly rude and vulgar in several Middle Eastern and West African countries, equivalent to the middle finger. <strong>DO NOT USE IT!</strong>"
            }
        ]
    },
};

// data for selectors
const G_DATA = {
    "thumbsUp": { emoji: "👍", name: "Thumbs Up", regions: { "middleEast": { name: "Middle East (Iran, Iraq...)", key: "thumbsUp_ME" } } },
};

const gestureSelect = document.getElementById('gesture-select');
const regionSelect = document.getElementById('region-select');
const startBtn = document.getElementById('start-simulation-btn');
const restartBtn = document.getElementById('restart-btn');
const selectorSection = document.getElementById('scenario-selector');
const simulatorContainer = document.getElementById('simulator-container');
const finalMessageBox = document.getElementById('final-message-box');
const scenarioCaption = document.getElementById('scenario-caption');


function initSelectors() {
    // fill gesture select
    gestureSelect.innerHTML = '<option value="" disabled selected>Select a gesture...</option>';
    Object.keys(G_DATA).forEach(key => {
        const gesture = G_DATA[key];
        const option = new Option(`${gesture.emoji} ${gesture.name}`, key);
        gestureSelect.add(option);
    });

    // event listeners
    gestureSelect.addEventListener('change', updateRegionSelect);
    regionSelect.addEventListener('change', () => {
        startBtn.disabled = regionSelect.value === '';
    });
    startBtn.addEventListener('click', startSimulation);
    restartBtn.addEventListener('click', restartSimulation);

    // initial state
    regionSelect.innerHTML = '<option value="" disabled selected>Select a region...</option>';
}

function updateRegionSelect() {
    const selectedGestureKey = gestureSelect.value;
    const regions = G_DATA[selectedGestureKey]?.regions || {};

    regionSelect.innerHTML = '<option value="" disabled selected>Select a region...</option>';
    regionSelect.disabled = Object.keys(regions).length === 0;

    Object.keys(regions).forEach(regionKey => {
        const region = regions[regionKey];
        const option = new Option(region.name, region.key);
        regionSelect.add(option);
    });
    startBtn.disabled = true;
}

function startSimulation() {
    currentKey = regionSelect.value;
    currentIndex = 0;
    if (!currentKey) return alert("Please select both a gesture and a region.");
    // hide selector, show simulator
    selectorSection.style.display = 'none';
    simulatorContainer.style.display = 'block';
    finalMessageBox.style.display = 'none';
    restartBtn.style.display = 'none';
    
    document.getElementById('img-1').src = '';
    document.getElementById('img-2').src = '';
    document.getElementById('img-3').src = '';
    playNextPanel();
}

function playNextPanel() {
    const scenario = SCNRS[currentKey];
    const state = scenario.states[currentIndex];
    scenarioCaption.textContent = state.text;

    document.getElementById('img-1').src = state.b1.img;
    document.getElementById('text-1').textContent = state.b1.cap;
    
    document.getElementById('img-2').src = state.b2.img;
    document.getElementById('text-2').textContent = state.b2.cap;
    
    document.getElementById('img-3').src = state.b3.img;
    document.getElementById('text-3').textContent = state.b3.cap;
    

    showImagesSequential(400); 
    if (currentIndex === scenario.states.length - 1) {
        setTimeout(showFinalMessage, DELAY); 
    } else {
        currentIndex++; 
        setTimeout(playNextPanel, DELAY); 
    }
}

function showFinalMessage() {
    const scenario = SCNRS[currentKey];
    const finalState = scenario.states[scenario.states.length - 1];

    finalMessageBox.innerHTML = finalState.finalMessage;
    finalMessageBox.style.display = 'block';
    restartBtn.style.display = 'block';
}

function restartSimulation() {
    currentIndex = 0;
    currentKey = '';
  
    simulatorContainer.style.display = 'none';
    selectorSection.style.display = 'block';
    
    gestureSelect.value = '';
    updateRegionSelect(); 
    startBtn.disabled = true;
}

function showImagesSequential(step = 220) {
    const ids = ['#block-1', '#block-2', '#block-3'];
    
    ids.forEach(sel => {
        const el = document.querySelector(sel + ' .reveal');
        if (el) el.classList.remove('show-animated');
        void el.offsetWidth;
    });
    ids.forEach((sel, i) => {
        const el = document.querySelector(sel + ' .reveal');
        if (!el) return;
        setTimeout(() => {
            el.classList.add('show-animated');
        }, i * step);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSelectors();
});