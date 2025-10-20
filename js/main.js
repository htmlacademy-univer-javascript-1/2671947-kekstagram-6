import { generatePhotos } from './generate.js';

// Создаем и экспортируем массив фотографий
const photos = generatePhotos();

// Экспортируем данные для использования в других модулях
export { photos };
