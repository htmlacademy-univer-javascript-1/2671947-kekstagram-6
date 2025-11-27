import { generatePhotos } from './generate.js';
import { renderThumbnails } from './thumbnail.js';

// Создаем и экспортируем массив фотографий
const photos = generatePhotos();

// Отрисовываем миниатюры после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  renderThumbnails();
});

// Экспортируем данные для использования в других модулях
export { photos };
