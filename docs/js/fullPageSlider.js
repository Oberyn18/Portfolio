'use strict';

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
    // window.scrollTo(newPos);
};

// Retorna la sección sobre la cual se está actualmente
var getActualSection = function getActualSection(sections) {
    var actualScroll = getCurrentPosition();
    for (var i = 0; i < sections.length - 1; i++) {
        var difference = Math.floor((sections[i] + sections[i + 1]) / 2);
        if (actualScroll < difference) {
            return sections[i];
        }
    }
    return sections[sections.length - 1];
};

// Retorna todas las secciones en un array
var getSections = function getSections() {
    var e1 = document.getElementById('header');
    var e2 = document.getElementById('about');
    var e3 = document.getElementById('skills');
    var e4 = document.getElementById('works');
    var e5 = document.getElementById('contact');
    return [getElementPosition(e1), getElementPosition(e2), getElementPosition(e3), getElementPosition(e4), getElementPosition(e5)];
};

// Evento para la rueda del ratón
var flag = true;
var wheelMove = function wheelMove(sections, actualSectionInd) {
    var total = sections.length;
    window.addEventListener('wheel', function (e) {
        e.preventDefault();
        if (flag) {
            flag = false;
            if (e.deltaY > 0) {
                ++actualSectionInd;
            } else {
                if (actualSectionInd != 0) {
                    --actualSectionInd;
                } else {
                    actualSectionInd = total - 1;
                }
            }
            actualSectionInd = actualSectionInd % total;
            changeScroll(sections[actualSectionInd]);
            changeStatus();
        }
    });
};

// Cambiar el estado de la bandera del evento rueda del ratón
var changeStatus = function changeStatus() {
    setTimeout(function () {
        flag = true;
    }, 1000);
};

wheelMove(getSections(), 0, getCurrentPosition);

// FALTA:
// Bloquear la barra de navegación
// Como todo está a 100vh, hacer el evento con el que la rueda del ratón te permita ir de abajo hacia arriba y viceversa
// Asignarle un evento a los botones de la barra de tareas para que te redirigan a la porción señalada.
// Asignarle el evento a los botones de alguans secciones para que te dirijan a la sección siguiente.
// Hacer que el desplazamiento se vea bacán.


// console.log(getElementPosition(e1));
// console.log(getElementPosition(e2));
// console.log(getElementPosition(e3));
// console.log(getElementPosition(e4));
// console.log(getElementPosition(e5));

// // changeScroll(getElementPosition(e5));
// console.log(getActualSection([getElementPosition(e1),
//     getElementPosition(e2),
//     getElementPosition(e3),
//     getElementPosition(e4),
//     getElementPosition(e5)]));


// setTimeout(function () {
//     changeScroll(getActualSection([getElementPosition(e1),
//         getElementPosition(e2),
//         getElementPosition(e3),
//         getElementPosition(e4),
//         getElementPosition(e5)]));
// }, 2000);