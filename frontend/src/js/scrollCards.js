const container = document.querySelector('.main-tracks--container-wrapper');

const handleWheelScroll = (event) => {
    if (window.innerWidth >= 1024) {
        event.preventDefault();
        container.scrollLeft += event.deltaY;
    }
};

container.addEventListener('wheel', handleWheelScroll);
