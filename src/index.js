import { testDictionary, realDictionary } from './dictionary.js';
import { items } from './items.js';

// for testing purposes, make sure to use the test dictionary
console.log('test dictionary:', testDictionary);

const dictionary = realDictionary;
const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill('')),
  currentRow: 0,
  currentCol: 0,
  selectedItem: items[Math.floor(Math.random() * items.length)]
};

function updateGuesses() {
  const guessBoxes = document.querySelectorAll('.guess-box');
  state.grid.forEach((row, i) => {
    const word = row.join('');
    if (word) {
      guessBoxes[i].textContent = word;
    }
  });
}

function handleGuess(guess) {
  if (state.currentRow >= 6) {
    return;
  }

  if (isWordValid(guess)) {
    const guessBox = document.querySelectorAll('.guess-box')[state.currentRow];
    const guessRow = guessBox.parentElement;
    const actualPrice = state.selectedItem.price_dollar_cents;
    const guessPrice = parseFloat(guess);

    // Add animated class for flip
    guessBox.classList.add('animated');

    // Remove the animation class after it completes
    guessBox.addEventListener('animationend', () => {
      guessBox.classList.remove('animated');
      // Add shrink class after flip animation
      guessBox.classList.add('shrink');
    }, { once: true });

    guessBox.textContent = `$${guessPrice.toFixed(2)}`;

    const priceDiff = Math.abs(guessPrice - actualPrice);
    const isHigher = guessPrice > actualPrice;

    // Create arrow box
    const arrowBox = document.createElement('div');
    arrowBox.className = 'arrow-box';
    arrowBox.textContent = isHigher ? '↓' : '↑';

    // Remove existing arrow box if present
    const existingArrowBox = guessRow.querySelector('.arrow-box');
    if (existingArrowBox) {
      existingArrowBox.remove();
    }

    if (priceDiff <= 0.40) {
      guessBox.style.background = 'var(--right)';

      // Create checkmark box before animation
      const checkmarkBox = document.createElement('div');
      checkmarkBox.className = 'checkmark-box';
      checkmarkBox.textContent = '✓';

      // Remove existing arrow box if present
      if (existingArrowBox) {
        existingArrowBox.remove();
      }

      // Append checkmark box before starting animation
      guessRow.appendChild(checkmarkBox);

      // Add animated class for flip to both elements
      guessBox.classList.add('animated');
      checkmarkBox.classList.add('animated');

      // Remove the animation classes after they complete
      guessBox.addEventListener('animationend', () => {
        guessBox.classList.remove('animated');
        checkmarkBox.classList.remove('animated');
        // Add shrink class after flip animation
        guessBox.classList.add('shrink');
      }, { once: true });

      const inputContainer = document.querySelector('.input-container');
      inputContainer.style.display = 'none';
    } else if (priceDiff <= 1.00) {
      guessBox.style.background = 'var(--close)';
      arrowBox.style.background = 'var(--close)';

      // Add animated class to both elements
      guessBox.classList.add('animated');
      arrowBox.classList.add('animated');

      // Remove animation classes after completion
      guessBox.addEventListener('animationend', () => {
        guessBox.classList.remove('animated');
        arrowBox.classList.remove('animated');
        // Add shrink class after flip animation
        guessBox.classList.add('shrink');
      }, { once: true });

      guessRow.appendChild(arrowBox);
    } else {
      guessBox.style.background = 'var(--wrong)';
      arrowBox.style.background = 'var(--wrong)';

      // Add animated class to both elements
      guessBox.classList.add('animated');
      arrowBox.classList.add('animated');

      // Remove animation classes after completion
      guessBox.addEventListener('animationend', () => {
        guessBox.classList.remove('animated');
        arrowBox.classList.remove('animated');
        // Add shrink class after flip animation
        guessBox.classList.add('shrink');
      }, { once: true });

      guessRow.appendChild(arrowBox);
    }

    state.currentRow++;
    updateGuessCounter();

    if (state.currentRow >= 6) {
      const inputContainer = document.querySelector('.input-container');
      inputContainer.style.display = 'none';
    }
  }
}

// Replace keyboard events with input handling
function registerInputEvents() {
  const input = document.querySelector('.guess-input');
  const submitButton = document.querySelector('.submit-button');

  submitButton.addEventListener('click', () => {
    const guess = input.value;
    // Check if input can be converted to a valid number
    const numberGuess = parseFloat(guess);
    if (!isNaN(numberGuess)) {
      // Format to 2 decimal places
      const formattedGuess = numberGuess.toFixed(2);
      handleGuess(formattedGuess);
      input.value = '';
    } else {
      // Just clear invalid input
      input.value = '';
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const guess = input.value;
      // Check if input can be converted to a valid number
      const numberGuess = parseFloat(guess);
      if (!isNaN(numberGuess)) {
        // Format to 2 decimal places
        const formattedGuess = numberGuess.toFixed(2);
        handleGuess(formattedGuess);
        input.value = '';
      } else {
        // Just clear invalid input
        input.value = '';
      }
    }
  });
}

function isWordValid(word) {
  const numberGuess = parseFloat(word);
  return !isNaN(numberGuess);
}

function getNumOfOccurrencesInWord(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function getPositionOfOccurrence(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function drawImage(container) {
  const imageFrame = document.createElement('div');
  imageFrame.className = 'image-frame';

  const img = document.createElement('img');
  const randomImage = items[Math.floor(Math.random() * items.length)];

  img.src = randomImage.src;
  img.alt = randomImage.alt;
  img.className = 'header-image';

  const caption = document.createElement('div');
  caption.className = 'image-caption';
  caption.textContent = randomImage.caption;

  imageFrame.appendChild(img);
  imageFrame.appendChild(caption);
  container.appendChild(imageFrame);
}

function updateGuessCounter() {
  const counter = document.getElementById('guess-counter');
  counter.textContent = `Guess: ${state.currentRow}/6`;
}

function startup() {
  const imageContainer = document.getElementById('image-container');
  drawImage(imageContainer);
  updateGuessCounter();
  registerInputEvents();
}

startup();
