function setFeatherIcons() {
    feather.replace();
}

document.addEventListener("DOMContentLoaded", () => {

    setFeatherIcons();
    const renderNavbar = () => {
        const navbar = window.location.href('/view/components/navbar.html');
        if (navbar) {
            document.querySelector('body').insertAdjacentHTML('afterbegin', navbar);
        }
    }
});