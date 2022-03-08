let lastKnownScrollPosition = 0;
let ticking = false;

let header = document.getElementById('header')
let links = header.querySelectorAll('.link')

let menu = document.getElementById('menu')
let overlay = document.getElementById('overlay')
let menuOpen = false

let displayItems = 1;
if (window.innerWidth >= 1280) {
    displayItems = 3
} else if (window.innerWidth >= 880) {
    displayItems = 2
}
const carousel = document.querySelector("[data-target='articles']");
const card = carousel.querySelector("[data-target='article']");
const cards = carousel.querySelectorAll("[data-target='article']");
let carouselWidth = carousel.offsetWidth;
let cardWidth = card.offsetWidth;
const cardStyle = card.currentStyle || window.getComputedStyle(card)
let cardMarginRight = Number(cardStyle.marginRight.match(/\d+/g)[0]) * 2;
const cardCount = carousel.querySelectorAll("[data-target='article']").length;
let offset = 0;
let currentCard = 1;
let maxX = -((cardCount / displayItems) * (cardWidth + cardMarginRight));
if (displayItems === 1) {
    maxX += 2 * (cardWidth + cardMarginRight)
}

let steps = []
setSteps()

let timer;
setTimer()
setCarouselHeight()

window.addEventListener('resize', function (event) {
    clearInterval(timer)

    if (window.innerWidth >= 1280) {
        displayItems = 3
    } else if (window.innerWidth >= 880) {
        displayItems = 2
    } else if (window.innerWidth <= 880) {
        displayItems = 1
    }

    carouselWidth = carousel.offsetWidth
    cardWidth = card.offsetWidth
    cardMarginRight = Number(cardStyle.marginRight.match(/\d+/g)[0]) * 2;
    maxX = -((cardCount / displayItems) * (cardWidth + cardMarginRight))

    if (displayItems === 1) {
        maxX += 2 * (cardWidth + cardMarginRight)
    }

    offset = -(carouselWidth - (currentCard * (cardWidth + cardMarginRight)))

    setSteps()
    setCarouselHeight()
    setTimer(true)
});

let posX1 = 0
let posX2 = 0
let distance = 0

cards.forEach(card => {
    card.addEventListener("mouseover", function (event) {
        clearInterval(timer)
    }, {
        passive: true
    });
});
cards.forEach(card => {
    card.addEventListener("touchstart", function (event) {
        clearInterval(timer)

        carousel.classList.add('notransition');

        if (event.type == 'touchstart') {
            posX1 = event.touches[0].clientX;
        } else {
            posX1 = event.clientX;
        }

        // console.log(posX1)
    }, {
        passive: true
    });
});
cards.forEach(card => {
    card.addEventListener("touchmove", function (event) {

        if (event.type == 'touchmove') {
            posX2 = event.touches[0].clientX
        } else {
            posX2 = event.clientX;
        }
        distance = posX1 - posX2;

        // console.log('position', posX1, posX2, distance)

        offset = -(distance)

        if (offset >= 0) {
            offset = 0;
        } else if (offset <= (maxX - (cardWidth + cardMarginRight))) {
            offset = maxX - (cardWidth + cardMarginRight);
        }

        // console.log(distance, offset)

        carousel.style.transform = `translateX(${offset}px)`;
    }, {
        passive: true
    });
});
cards.forEach(card => {
    card.addEventListener("mouseout", function (event) {
        setTimer()
    }, {
        passive: true
    });
});
cards.forEach(card => {
    card.addEventListener("touchend", function (event) {

        if (offset >= 0) {
            offset = 0;
        } else if (offset <= (maxX - (cardWidth + cardMarginRight))) {
            offset = maxX - (cardWidth + cardMarginRight);
        } else {
            offset = closestToZero()
        }

        carousel.style.transform = `translateX(${offset}px)`;

        carousel.classList.remove('notransition');

        setTimer()
    }, {
        passive: true
    });
});

function setSteps() {
    steps = []
    for (let index = 1; index <= (cardCount / displayItems + 1); index++) {
        steps.push(-(index * (cardWidth + cardMarginRight)))
    }
    // console.log('steps', steps)
}

function closestToZero() {
    let closest = steps.reduce(function (prev, curr) {
        return (Math.abs(curr - offset) < Math.abs(prev - offset) ? curr : prev);
    })

    return closest;
}

function setCarouselHeight() {
    let cards = carousel.querySelectorAll("[data-target='article']")
    let maxHeight = 0;
    cards.forEach(card => {
        if (maxHeight < card.offsetHeight) {
            maxHeight = card.offsetHeight
        }
    });

    // console.log(maxHeight)
    document.getElementById('article-wrapper').style.height = (maxHeight + 50) + 'px'

}

function setTimer(now) {
    if (now) {
        if (offset >= maxX) {
            offset -= cardMarginRight + cardWidth;
            carousel.style.transform = `translateX(${offset}px)`;
            currentCard++
        } else if (offset <= maxX) {
            offset = 0;
            currentCard = 1;
            carousel.style.transform = `translateX(${offset}px)`;
        }
    }

    timer = setInterval(() => {
        if (offset >= maxX) {
            offset -= cardMarginRight + cardWidth;
            carousel.style.transform = `translateX(${offset}px)`;
            currentCard++
        } else if (offset <= maxX) {
            offset = 0;
            currentCard = 1;
            carousel.style.transform = `translateX(${offset}px)`;
        }
    }, 5000)
}

function openMenu() {
    menu.classList.replace('translate-x-full', 'translate-x-0')
    overlay.classList.replace('pointer-events-none', 'pointer-events-auto')
    overlay.classList.replace('opacity-0', 'opacity-50')
    menuOpen = true
}

function closeMenu() {
    menu.classList.replace('translate-x-0', 'translate-x-full')
    overlay.classList.replace('pointer-events-auto', 'pointer-events-none')
    overlay.classList.replace('opacity-50', 'opacity-0')
    menuOpen = false
}

function doSomething(scrollPos) {
    // console.log('scrollPos', scrollPos)

    if (scrollPos !== 0) {
        header.classList.replace('xl:h-28', 'xl:h-20')

        links.forEach(link => {
            link.classList.replace('xl:py-10', 'xl:py-6')
        })
    } else {
        header.classList.replace('xl:h-20', 'xl:h-28')

        links.forEach(link => {
            link.classList.replace('xl:py-6', 'xl:py-10')
        })
    }

}

document.addEventListener('scroll', function (e) {
    lastKnownScrollPosition = window.scrollY

    if (!ticking) {
        window.requestAnimationFrame(function () {
            doSomething(lastKnownScrollPosition)
            ticking = false;
        })

        ticking = true;
    }
});