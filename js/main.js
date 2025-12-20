import { renderThumbnails } from './thumbnail.js';
import { getData } from './api.js';
import { showAlert } from './message.js';
import './form.js';

getData()
  .then((photos) => {
  renderThumbnails(photos);
})
  .catch((err) => {
  showAlert(err.message);
});
