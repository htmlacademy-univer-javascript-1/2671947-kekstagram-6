/* eslint-disable no-unused-vars */

function checkLen(string, maxlen) {
  return string.lenght <= maxlen;
}


function isPalindrome(string) {
  // Приводим строку к нижнему регистру и удаляем пробелы
  const cleanString = string.toLowerCase().replaceAll(' ', '');

  // Сравниваем строку с перевернутой версие
  return cleanString === cleanString.split('').reverse().join('');
}


function isMeetingWithinWorkHours(workStart, workEnd, meetingStart, meetingDuration) {
  // Функция для преобразования времени в минуты
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Преобразуем все времена в минуты
  const workStartMinutes = timeToMinutes(workStart);
  const workEndMinutes = timeToMinutes(workEnd);
  const meetingStartMinutes = timeToMinutes(meetingStart);

  // Вычисляем время окончания встречи
  const meetingEndMinutes = meetingStartMinutes + meetingDuration;

  // Проверяем, что встреча полностью вписывается в рабочий день
  return meetingStartMinutes >= workStartMinutes &&
         meetingEndMinutes <= workEndMinutes;
}
