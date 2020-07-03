import '../css/style.css';

const currentTime = () => {
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hour < 10 ? '0' + hour : hour}시 ${minutes < 10 ? '0' + minutes : minutes}분 ${seconds < 10 ? '0' + seconds : seconds}초`;
}

const timerElement = document.createElement('article');
timerElement.id = 'timer';

setInterval(() => {
  timerElement.innerHTML = currentTime();
}, 1000);

console.log('d');
document.querySelector('#content').appendChild(timerElement);