document.addEventListener("DOMContentLoaded", () => {
    const aside = document.querySelector(".aside");
    const toggleButton = document.getElementById("aside-toggle");
    const mainContent = document.querySelector(".main");

    const checkScreenWidth = () => {
        if (window.innerWidth > 1024) {
            mainContent.classList.remove("shift");
            aside.classList.remove("open");
        }
    };

    toggleButton.addEventListener("click", () => {
        aside.classList.toggle("open");
        mainContent.classList.toggle("shift");
    });

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);
});
