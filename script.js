/**
 * PHOTO EDITOR PRO 
 * Lógica: Manipulación de Canvas API y lectura de archivos
 */

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const uploadBtn = document.getElementById('upload-btn');
const uploadInput = document.getElementById('upload-file');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');
const placeholder = document.getElementById('placeholder-text');

// Filtros
const filters = {
    brightness: document.getElementById('brightness'),
    contrast: document.getElementById('contrast'),
    saturate: document.getElementById('saturate'),
    sepia: document.getElementById('sepia'),
    blur: document.getElementById('blur')
};

let activeImage = null;

// 1. Manejo de Subida de Archivo
uploadBtn.addEventListener('click', () => uploadInput.click());

uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // Ajustamos el tamaño del canvas a la imagen real
            canvas.width = img.width;
            canvas.height = img.height;
            activeImage = img;
            
            // UI Update
            canvas.style.display = 'block';
            placeholder.style.display = 'none';
            
            applyAllFilters();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// 2. Función Maestra de Filtros
function applyAllFilters() {
    if (!activeImage) return;

    // Aplicamos la cadena de filtros de CSS al contexto del Canvas
    ctx.filter = `
        brightness(${filters.brightness.value}%)
        contrast(${filters.contrast.value}%)
        saturate(${filters.saturate.value}%)
        sepia(${filters.sepia.value}%)
        blur(${filters.blur.value}px)
    `;

    // Redibujamos la imagen original con el filtro aplicado
    ctx.drawImage(activeImage, 0, 0, canvas.width, canvas.height);
}

// 3. Listeners en tiempo real para los sliders
Object.values(filters).forEach(slider => {
    slider.addEventListener('input', applyAllFilters);
});

// 4. Botón Reset
resetBtn.addEventListener('click', () => {
    filters.brightness.value = 100;
    filters.contrast.value = 100;
    filters.saturate.value = 100;
    filters.sepia.value = 0;
    filters.blur.value = 0;
    applyAllFilters();
});

// 5. Descarga de Imagen (El truco del link invisible)
downloadBtn.addEventListener('click', () => {
    if (!activeImage) return alert("Primero sube una foto");

    // Convertimos el contenido del canvas a un link de descarga
    const link = document.createElement('a');
    link.download = 'facundo-edit.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});