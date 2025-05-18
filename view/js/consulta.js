const btnGroup = document.querySelector(".btn-group");

if (grupopaciente) { click ,function (&gt;) {

if (btnGroup) {
    btnGroup.addEventListener("click", function (e) {
        if (e.target.tagName === "BUTTON") {
            const selectedButton = e.target;
            const buttons = btnGroup.querySelectorAll("button");
            buttons.forEach((button) => {
                button.classList.remove('active');
            });
            selectedButton.classList.add("active");
        }
    });
}