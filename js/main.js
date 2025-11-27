// main.js
import { generatePhotos } from './generate.js';
import { renderThumbnails } from './thumbnail.js';
import './form.js'; // Подключаем модуль формы

// Создаем и экспортируем массив фотографий
const photos = generatePhotos();

// Отрисовываем миниатюры после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  renderThumbnails();
});

// Экспортируем данные для использования в других модулях
export { photos };
