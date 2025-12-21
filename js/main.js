// main.js
import { renderThumbnails } from './thumbnail.js';
import { getData } from './api.js';
import { showAlert } from './message.js';
import { initFilter } from './filter.js'; // Импортируем инициализацию фильтра
import './form.js';

getData()
  .then((photos) => {
  renderThumbnails(photos);
  initFilter(photos); // Показываем фильтры и передаем данные после загрузки
})
  .catch((err) => {
  showAlert(err.message);
});
