
let cursor;
let cursorX = 0;
let cursorY = 0;
let scrollObjective = window.scrollY;
document.addEventListener('DOMContentLoaded', () => {
    cursor = document.querySelector('.cursor'); 
    document.addEventListener('mousemove', e => [cursorX, cursorY] = [e.clientX, e.clientY]);
    ['a', '.btn'].forEach(tagName => Array.from(document.querySelectorAll(tagName)).forEach(element => [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => element.addEventListener(obj.event, () => cursor.classList.toggle('cursor-hover', obj.isHovering)))));
    document.addEventListener('scroll', () => {[{identifier: '.text-tipo', modifyClass: 'tipo-shown'}, {identifier: '.card', modifyClass: 'card-shown'}].forEach(obj => showElementsOnSight(obj.identifier, obj.modifyClass))});
    document.addEventListener('wheel', e => {e.preventDefault(); updateScrollObjective(e)}, {passive: false})
    // document.addEventListener('scroll', e => {e.preventDefault(); updateScrollObjective()}, {passive: false})
    moveCursor();
    smoothScroll();
})

function updateScrollObjective(e){
    scrollObjective = e ? scrollObjective + e.deltaY : window.scrollY;
}

function moveCursor(){
    cursor.style.top = `${lerp(cursor.offsetTop, cursorY, 0.2)}px`
    cursor.style.left = `${lerp(cursor.offsetLeft, cursorX, 0.2)}px`
    requestAnimationFrame(moveCursor)
}

function smoothScroll() {
    window.scrollTo({ top: lerp(window.scrollY, scrollObjective, 0.04) });
    requestAnimationFrame(smoothScroll);
}


const lerp = (start, end, amt) => (1 - amt) * start + amt * end
  

function showElementsOnSight(identifier, modifyClass){
    const elements = document.querySelectorAll(identifier)
    for (const element of elements) {
        const elementRect = element.getBoundingClientRect();
        const marginActive = 100;
        const elementMiddleY = elementRect.top + (elementRect.height / 2);
        const isOnSight = elementMiddleY < window.innerHeight - marginActive && elementMiddleY > marginActive;
        element.classList.toggle(modifyClass, isOnSight);
    }
}