'use strict';

var disableScrollBar = function disableScrollBar() {
    document.body.classList.add('stop-scroll');
};

var disableTouch = function disableTouch() {
    document.body.classList.add('stop-touch');
};

var enableScrollBar = function enableScrollBar() {
    document.body.classList.remove('stop-scroll');
};

var enableTouch = function enableTouch() {
    document.body.classList.remove('stop-touch');
};

// Disables default behavior of element e

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
}

var disableScroll = function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
};

var enableScroll = function enableScroll() {
    if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
};

// Retorna la posición actual del scroll
var getCurrentPosition = function getCurrentPosition() {
    return document.scrollingElement.scrollTop;
};

// Retorna la posición del elemento respecto al body, es decir, en toda la página
var getElementPosition = function getElementPosition(element) {
    return element.offsetTop;
};

// Asigna al scroll una nueva posición, pasada por parámetro
var changeScroll = function changeScroll(newPos) {
    document.scrollingElement.scrollTop = newPos;
};

// Retorna el índice de la sección sobre la cual se está actualmente
var getActualSectionInd = function getActualSectionInd(sections) {
    var actualScroll = getCurrentPosition();
    // Itero hasta el penúltimo, ya que lo que quiero son las diferencias entre los consecutivos (y llegaré al último de todas formas)
    for (var i = 0; i < sections.length - 1; i++) {
        // El promedio de las posiciones de las seccion consecutivas es la posición de la mitad entre dichas secciones
        var medianPos = Math.floor((sections[i][1] + sections[i + 1][1]) / 2);
        if (actualScroll < medianPos) {
            // Si no paso esa mitad, estoy donde debo estar, pues las posiciones las estoy recorriendo en orden ascendente.
            return i;
        }
    }
    // Si nunca estuve antes de la diferencia entre las consecutivas, debo estar al final de todo.
    return sections.length - 1;
};

// Recibe el nombre de los Id's de las secciones y retorna todas las secciones y sus posiciones, en un array bidimensional
var getSections = function getSections(sectionsIds) {
    var sections = new Array();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = sectionsIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var sectionId = _step.value;

            var e = document.getElementById(sectionId);
            var position = getElementPosition(e);
            sections.push([e, position]);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return sections;
};

// Función que simula el "easing"
var easing = function easing(progress) {
    return progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
};

// Esta bandera activará y desactivará el scroll con el mouse en el evento siguiente, se define ahora porque animatedScrolling la usa
var flag = false;
var animatedScrolling = function animatedScrolling(startPos, finalPos, waitTime) {
    var runAnimation = void 0; // guardará el animation frame
    var timeLapsed = 0; // acumulador del tiempo transcurrido
    var percentage = void 0,
        position = void 0; // contenedores de las posiciones actuales y porcentaje avanzado
    var duration = 2000; // duración deseada
    var distance = finalPos - startPos; // distancia entre ambas posiciones
    var animate = function animate() {
        timeLapsed += 16;
        percentage = timeLapsed / duration;
        percentage = percentage > 1 ? 1 : percentage;
        position = startPos + distance * easing(percentage);
        changeScroll(position);
        runAnimation = requestAnimationFrame(animate);
        if (position == finalPos) {
            cancelAnimationFrame(runAnimation);
            setTimeout(function () {
                flag = true;
            }, waitTime);
        }
    };
    runAnimation = requestAnimationFrame(animate);
};

var fullPageSlider = function fullPageSlider() {
    // Esta variable (sectionsNames) se debe sobreescribir siempre que se use este slider en distintos proyectos.
    var sectionsNames = ['header', 'about', 'skills', 'works', 'contact', 'footer'];
    // Contiene pares (elementoHTML, posición en Y) sobre los cuales haremos el scroll
    var sections = getSections(sectionsNames);
    // Índice de la sección que debería ocupar el viewport actualmente
    var actualSectionInd = getActualSectionInd(sections);
    // Posición actual
    var startPos = getCurrentPosition();
    // Posición final (posición que debería estar ocupando el viewport)
    var endPos = sections[actualSectionInd][1];
    // Animar el movimiento de la posición actual a la posición indicada.
    animatedScrolling(startPos, endPos, 500);
    // ----- EVENTO PARA LA RUEDA DEL RATÓN
    // Total de secciones
    var total = sections.length;
    window.addEventListener('wheel', function (e) {
        e.preventDefault();
        if (flag) {
            flag = false;
            // Con actualSectionInd sabré cual es la sección actual
            startPos = sections[actualSectionInd][1]; // posición inicial
            if (e.deltaY > 0) {
                // La sección a la que iré está después
                ++actualSectionInd;
            } else {
                if (actualSectionInd != 0) {
                    --actualSectionInd;
                } else {
                    actualSectionInd = total - 1;
                }
            }
            actualSectionInd %= total;
            endPos = sections[actualSectionInd][1]; // posición final
            animatedScrolling(startPos, endPos, 0);
        }
    });
};

fullPageSlider();

/*
 TODO:
 - Cambiar esa bandera por un evento que bloquee el touch y la rueda del mouse.
 - Hacer los eventos para el touch.
*/

// ---------------------------------------------------------- TOUCHSCREEN !!!! -------------------------------------------------

/*
const moveToSection = (direction, sections) => {
    let startPos = getActualSection(sections)[0];
    let actualSectionInd = getActualSection(sections)[1];
    let total = sections.length;
    if (direction == 'down') {
        ++actualSectionInd;
    } else if (direction == 'up'){
        if (actualSectionInd != 0) {
            --actualSectionInd;
        }else {
            actualSectionInd = total - 1;
        }
    } else {
        console.log('ERROR!');
    }
    let finalPos = sections[actualSectionInd + 1];
    console.log("Posición actual: ", startPos);
    console.log("Sección actual: ", actualSectionInd);
    let runAnimation; // guardará el animation frame
    let timeLapsed = 0; // acumulador del tiempo transcurrido
    let percentage, position; // contenedores de las posiciones actuales y porcentaje avanzado
    let duration = 2000; // duración deseada
    let distance = finalPos - startPos; // distancia entre ambas posiciones
    const animate = () => {
        timeLapsed += 16;
        percentage = timeLapsed / duration;
        percentage = percentage > 1 ? 1 : percentage;
        position = startPos + distance * easing(percentage);
        changeScroll(position);
        runAnimation = requestAnimationFrame(animate);
        if (position == finalPos) {
            cancelAnimationFrame(runAnimation);
            setTimeout(function () {
                
            }, 2000);  
        }
    };
    runAnimation = requestAnimationFrame(animate);
}
const swipeDetect = (sections) => {
    let swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 1000, // maximum time allowed to travel that distance
    elapsedTime,
    startTime;
    window.addEventListener("touchstart", (e) => {
        e.preventDefault();
        let touchobj = e.changedTouches[0]
        swipedir = 'none';
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime() // record time when finger first makes contact with surface
    }, false);
    
    window.addEventListener("touchend", (e) => {
        e.preventDefault()
        let touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'down' : 'up' // if dist traveled is negative, it indicates up swipe
            }
        }
        console.log(swipedir);
        moveToSection(swipedir, sections);
    });

}
const initSwipeMovement = () => {
    let sections = getSections();
    swipeDetect(sections);
};


const moveToSection = (direction, sections) => {
    let startPos = getActualSection(sections)[0];
    let actualSectionInd = getActualSection(sections)[1];
    let total = sections.length;
    if (direction == 'down') {
        ++actualSectionInd;
    } else if (direction == 'up'){
        if (actualSectionInd != 0) {
            --actualSectionInd;
        }else {
            actualSectionInd = total - 1;
        }
    } else {
        console.log('ERROR!');
    }
    let finalPos = sections[actualSectionInd + 1];
    console.log("Posición actual: ", startPos);
    console.log("Sección actual: ", actualSectionInd);
    let runAnimation; // guardará el animation frame
    let timeLapsed = 0; // acumulador del tiempo transcurrido
    let percentage, position; // contenedores de las posiciones actuales y porcentaje avanzado
    let duration = 2000; // duración deseada
    let distance = finalPos - startPos; // distancia entre ambas posiciones
    const animate = () => {
        timeLapsed += 16;
        percentage = timeLapsed / duration;
        percentage = percentage > 1 ? 1 : percentage;
        position = startPos + distance * easing(percentage);
        changeScroll(position);
        runAnimation = requestAnimationFrame(animate);
        if (position == finalPos) {
            cancelAnimationFrame(runAnimation);
            setTimeout(function () {
                
            }, 2000);  
        }
    };
    runAnimation = requestAnimationFrame(animate);
}

*/
// FALTA:
// Asignarle un evento a los botones de la barra de tareas para que te redirigan a la porción señalada.
// Asignarle el evento a los botones de alguans secciones para que te dirijan a la sección siguiente.