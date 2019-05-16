

    function menuTitleIn(title) {
        let item = document.getElementById('menu-title')
        item.style.opacity = "1";
        item.innerHTML = title;
    }

    function menuTitleOut() {
        let item = document.getElementById('menu-title')
        item.style.opacity = "0";
        //item.innerHTML = 'Laravel';
    }

