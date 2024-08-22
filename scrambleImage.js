let scrambledCanvas; // To hold the scrambled canvas
let blocks = []; // Global blocks list
let isSorting = false;
let speed = 0;
let algorithm = "Insertion Sort";
let originalImageDataURL = '';

function chooseAlgorithm(alg) {
  algorithm = alg;
}

const scrambleImage = (image, blocksPerSide) => {
  if (isSorting) { // If insertion sort is running, stop it
    isSorting = false;
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const width = image.width;
  const height = image.height;

  canvas.width = width;
  canvas.height = height;

  const blockSizeX = Math.ceil(width / blocksPerSide);
  const blockSizeY = Math.ceil(height / blocksPerSide);

  blocks = []; // Reset global blocks list

  index = 0;
  for (let y = 0; y < height; y += blockSizeY) {
    for (let x = 0; x < width; x += blockSizeX) {
      blocks.push({ x, y, index });
      index++;
    }
  }

  shuffleArray(blocks);

  let k = 0;

  for (let i = 0; i < height; i += blockSizeY) {
    for (let j = 0; j < width; j += blockSizeX) {
      ctx.drawImage(
        image,
        blocks[k].x,
        blocks[k].y,
        blockSizeX, // Source width
        blockSizeY,
        j,
        i,
        blockSizeX,
        blockSizeY
      );
      k++;
    }
  }

  scrambledCanvas = canvas; // Store the scrambled canvas
  return canvas.toDataURL();
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // For loading images from external sources
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

const mergeSortVisualize = (blocks, ctx, blockSizeX, blockSizeY, width, height) => {
  console.log('Brandon');
  const scrambledImage = document.getElementById('scrambledImage');
  const originalImage = document.getElementById('originalImage');

  async function renderBarGraph() {
    ctx.clearRect(0, 0, width, height);
    k = 0;
    for (let i = 0; i < height; i += blockSizeY) {
      for (let j = 0; j < width; j += blockSizeX) {
        ctx.drawImage(
          originalImage,
          blocks[k].x,
          blocks[k].y,
          blockSizeX, // Source width
          blockSizeY,
          j,
          i,
          blockSizeX,
          blockSizeY
        );
        k++;
      }
    }

    scrambledImage.src = scrambledCanvas.toDataURL();
  }

  function delay() {
    return new Promise(resolve => {
        setTimeout(resolve, speed); // Adjust the delay as needed
    });
  }

  async function mergeSort() {
    isSorting = true;
    await mergeSortRecursive(0, blocks.length - 1);
    if (!isSorting) return;
  }

  // DESC: Recursize merge sort
  async function mergeSortRecursive(start, end) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    if (!isSorting) return;
    await mergeSortRecursive(start, mid);
    await mergeSortRecursive(mid + 1, end);

    await merge(start, mid, end);
  }

  // DESC: Merge 2 sections of array in merge sort
  async function merge(start, mid, end) {
    const leftArray = blocks.slice(start, mid + 1);
    const rightArray = blocks.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < leftArray.length && j < rightArray.length) {
      if (!isSorting) return;
      if (leftArray[i].index <= rightArray[j].index) {
        blocks[k++] = leftArray[i++];
      } else {
        blocks[k++] = rightArray[j++];
      }
      await renderBarGraph();
      await delay();
    }

    while (i < leftArray.length) {
      if (!isSorting) return;
      blocks[k++] = leftArray[i++];
      await renderBarGraph();
      await delay();
    }

    while (j < rightArray.length) {
      if (!isSorting) return;
      blocks[k++] = rightArray[j++];
      await renderBarGraph();
      await delay();
    }
  }
  mergeSort();
};

const insertionSortVisualize = (blocks, ctx, blockSizeX, blockSizeY, width, height) => {

  const scrambledImage = document.getElementById('scrambledImage');
  const originalImage = document.getElementById('originalImage');

  async function renderBarGraph() {

    console.log(blocks);
    ctx.clearRect(0, 0, width, height);
    k = 0;
    for (let i = 0; i < height; i += blockSizeY) {
      for (let j = 0; j < width; j += blockSizeX) {
        ctx.drawImage(
          originalImage,
          blocks[k].x,
          blocks[k].y,
          blockSizeX, // Source width
          blockSizeY,
          j,
          i,
          blockSizeX,
          blockSizeY
        );
        k++;
      }
    }

    scrambledImage.src = scrambledCanvas.toDataURL();
  }

  function delay() {
    return new Promise(resolve => {
        setTimeout(resolve, speed); // Adjust the delay as needed
    });
  }

  async function insertionSort() {
    isSorting = true; // Set flag to true when insertion sort starts
    for (let i = 1; i < blocks.length; i++) {
        if (!isSorting) return; // Exit the function if reset button was clicked
        let key = blocks[i].index;
        let j = i - 1;
        while (j >= 0 && blocks[j].index > key) {
            await insertionSwap(j + 1, j);
            await delay();
            j = j - 1;
        }
        
        blocks[j + 1].index = key; // next key
        renderBarGraph();
    }

    renderBarGraph();

    isSorting = false; // Set flag to false when insertion sort completes
  }

// DESC: Swap function to visual moving of nodes
  async function insertionSwap(i, j) {
    return new Promise(resolve => {
        setTimeout(() => { // j is key, i is compare
            const temp = blocks[i];
            blocks[i] = blocks[j];
            blocks[j] = temp;
            renderBarGraph();
            resolve();
        }, delay()); // Adjust the delay as needed
    });
  }

  insertionSort();
};


const bubbleSortVisualize = (blocks, ctx, blockSizeX, blockSizeY, width, height) => {

  const scrambledImage = document.getElementById('scrambledImage');
  const originalImage = document.getElementById('originalImage');

  async function renderBubbleSort() {

    ctx.clearRect(0, 0, width, height);
    k = 0;
    for (let i = 0; i < height; i += blockSizeY) {
      for (let j = 0; j < width; j += blockSizeX) {
        ctx.drawImage(
          originalImage,
          blocks[k].x,
          blocks[k].y,
          blockSizeX, // Source width
          blockSizeY,
          j,
          i,
          blockSizeX,
          blockSizeY
        );
        k++;
      }
    }
    await delay();
    scrambledImage.src = scrambledCanvas.toDataURL();
  }

  function delay() {
    return new Promise(resolve => {
        setTimeout(resolve, speed); // Adjust the delay as needed
    });
  }

  

  async function bubbleSort() {
    tmp = [];
    sortedNodes = [];
    isSorting = true; // Set flag to true when bubble sort starts
    const n = blocks.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (!isSorting) return;
            tmp.push(j);

            // Delay for visualization
            await delay();

            if (blocks[j].index > blocks[j + 1].index) {
                // Swap bars
                await bubbleSwap(j, j + 1);
            }
            renderBubbleSort();
            tmp.pop(j);
        }
        sortedNodes.push(n - i - 1);
    }
    renderBubbleSort();
    // Set flag to false when bubble sort completes

  }

// DESC: Swap Nodes and maintain colors for bubble sort
  async function bubbleSwap(i, j) {
    return new Promise(resolve => {
        setTimeout(() => { // Add a delay for visualization
            const temp = blocks[i];
            blocks[i] = blocks[j];
            blocks[j] = temp;
            resolve();
        }, speed); // Adjust the delay as needed
    });
  }

  bubbleSort();

};




const heapSortVisualize = (blocks, ctx, blockSizeX, blockSizeY, width, height) => {

  const scrambledImage = document.getElementById('scrambledImage');
  const originalImage = document.getElementById('originalImage');

  async function renderHeapSort() {
    ctx.clearRect(0, 0, width, height);
    k = 0;
    for (let i = 0; i < height; i += blockSizeY) {
      for (let j = 0; j < width; j += blockSizeX) {
        ctx.drawImage(
          originalImage,
          blocks[k].x,
          blocks[k].y,
          blockSizeX, // Source width
          blockSizeY,
          j,
          i,
          blockSizeX,
          blockSizeY
        );
        k++;
      }
    }

    scrambledImage.src = scrambledCanvas.toDataURL();
  }

  function delay() {
    return new Promise(resolve => {
        setTimeout(resolve, speed); // Adjust the delay as needed
    });
  }

  async function heapSort() {
    isSorting = true; // Set flag to true when heap sort starts
    const n = blocks.length;
    sortedNodes = [];

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
        if (!isSorting) return;
    }

    renderHeapSort();

    // Heap sort
    for (let i = n - 1; i > 0; i--) {
        if (!isSorting) return;
        await heapSwap(0, i);
        sortedNodes.push(i);

        // document.querySelectorAll('.array-bar')[i].classList.add('sorted');
        await heapify(i, 0);
    }

    renderHeapSort();

    // Set flag to false when heap sort completes
    isSorting = false;
  }

  // DESC: Maintain heap structure
  async function heapify(n, i) {
      if (!isSorting) return;
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;

      if (left < n && blocks[left].index > blocks[largest].index) {
          largest = left;
      }

      if (right < n && blocks[right].index > blocks[largest].index) {
          largest = right;
      }

      if (largest !== i) {
          await heapSwap(i, largest);
          await heapify(n, largest);
      }
  }

  // DESC: Swap Nodes and maintain colors for heapsort
  async function heapSwap(i, j) {
      return new Promise(resolve => {
          setTimeout(() => { // j is key, i is compare
              const temp = blocks[i];
              blocks[i] = blocks[j];
              blocks[j] = temp;
              renderHeapSort();
              resolve();
          }, speed); // Adjust the delay as needed
      });
  }

  heapSort();
};

document.addEventListener('DOMContentLoaded', () => {
  const originalImageContainer = document.getElementById('originalImageContainer');
  const originalImage = document.getElementById('originalImage');
  const placeholder = document.getElementById('placeholder');
  const scrambleplaceholder = document.getElementById('scrambleplaceholder');
  const scrambledImage = document.getElementById('scrambledImage');
  const scrambleSlider = document.getElementById('scrambleSlider');
  const sortButton = document.getElementById('sortButton');

  let blocksPerSide = parseInt(scrambleSlider.value, 10);

  const scrambleCurrentImage = () => {
    const src = originalImage.src;
    if (!src) return;
    loadImage(src).then((image) => {
      const scrambledDataUrl = scrambleImage(image, blocksPerSide);
      scrambledImage.src = scrambledDataUrl;
    }).catch(err => console.error('Error loading image:', err));
  };

  scrambleSlider.addEventListener('input', (event) => {
    blocksPerSide = parseInt(event.target.value, 10);
    scrambleCurrentImage();
  });

  speedSlider.addEventListener('input', (event) => {
    speed = parseInt(event.target.value, 10);
  });
  
  // Drag-and-drop functionality
  originalImageContainer.addEventListener('dragover', (event) => {
    event.preventDefault();
    originalImageContainer.classList.add('drag-over');
  });

  originalImageContainer.addEventListener('dragleave', () => {
    originalImageContainer.classList.remove('drag-over');
  });

  originalImageContainer.addEventListener('drop', (event) => {
    event.preventDefault();
    originalImageContainer.classList.remove('drag-over');
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file, originalImage, scrambledImage, blocksPerSide);
    }
  });

  originalImageContainer.addEventListener('click', () => {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = 'image/png, image/jpeg';
    inputFile.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      handleFileUpload(file, originalImage, scrambledImage, blocksPerSide);
    };
    inputFile.click();
  });

  sortButton.addEventListener('click', async () => {
    if (!scrambledCanvas || blocks.length === 0) return; // Ensure we have a scrambled canvas and blocks
    if (isSorting) return;
    try {
      const ctx = scrambledCanvas.getContext('2d');
      const width = scrambledCanvas.width;
      const height = scrambledCanvas.height;

      const blockSizeX = Math.ceil(width / blocksPerSide);
      const blockSizeY = Math.ceil(height / blocksPerSide);

      console.log(algorithm);

      if (algorithm == 'Merge Sort') {
        await mergeSortVisualize(blocks, ctx, blockSizeX, blockSizeY, width, height);
      } else if (algorithm == 'Insertion Sort') {
        await insertionSortVisualize(blocks, ctx, blockSizeX, blockSizeY, width, height);
      } else if (algorithm == 'Heap Sort') {
        await heapSortVisualize(blocks, ctx, blockSizeX, blockSizeY, width, height);
      } else if (algorithm == 'Bubble Sort') {
        await bubbleSortVisualize(blocks, ctx, blockSizeX, blockSizeY, width, height);
      }

      scrambledImage.src = scrambledCanvas.toDataURL();
    } catch (err) {
      console.error('Error during sorting:', err);
    }
  });

  scrambleButton.addEventListener('click', async () => {
    const src = originalImage.src;
    if (!src) return;
    loadImage(src).then((image) => {
      const scrambledDataUrl = scrambleImage(image, blocksPerSide);
      scrambledImage.src = scrambledDataUrl;
    }).catch(err => console.error('Error loading image:', err));
  });

  function handleFileUpload(file, imageElement, scrambledElement, blocksPerSide) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imageElement.src = event.target.result;
      imageElement.classList.remove('hidden');
      scrambledElement.src = event.target.result;
      scrambledElement.classList.remove('hidden');
      placeholder.style.display = 'none';
      scrambleplaceholder.style.display = 'none';
      scrambleCurrentImage();
    };
    reader.readAsDataURL(file);
  }
});

