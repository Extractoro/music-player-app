const container = document.querySelector('.main-tracks--container-wrapper');

let isDragging = false;
let startX;
let scrollLeft;

container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
});

container.addEventListener('mouseup', (e) => {
    isDragging = false;
    container.style.cursor = 'default';
    const deltaX = Math.abs(e.pageX - startX);
    if (deltaX > 5) {
        e.preventDefault(); // Предотвращает переход по ссылке, если был скролл.
    }
});

container.addEventListener('mouseleave', () => {
    isDragging = false;
    container.style.cursor = 'default';
});

container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = x - startX;
    container.scrollLeft = scrollLeft - walk;
});

container.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
});

container.addEventListener('touchend', () => {
    isDragging = false;
});

container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
});
