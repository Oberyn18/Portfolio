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
};

// Retorna la sección sobre la cual se está actualmente
var getActualSection = function getActualSection(sections) {
    var actualScroll = getCurrentPosition();
    for (var i = 0; i < sections.length - 1; i++) {
        var difference = Math.floor((sections[i] + sections[i + 1]) / 2);
        if (actualScroll < difference) {
            return [sections[i], i];
        }
    }
    return [sections[sections.length - 1], sections.length - 1];
};

// Retorna todas las posiciones de las secciones escogidas, en un array
var getSections = function getSections() {
    var e1 = document.getElementById('header');
    var e2 = document.getElementById('about');
    var e3 = document.getElementById('skills');
    var e4 = document.getElementById('works');
    var e5 = document.getElementById('contact');
    var e6 = document.getElementById('footer');
    return [getElementPosition(e1), getElementPosition(e2), getElementPosition(e3), getElementPosition(e4), getElementPosition(e5), getElementPosition(e6)];
};

// Función que simula el "easing"
var easing = function easing(progress) {
    return progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
};

// Evento para la rueda del ratón
var wheelMovement = function wheelMovement(sections, actualSection) {

    // Cambiar el estado de la bandera del evento rueda del ratón
    var changeStatus = function changeStatus(actualPosition, endLocation, animationFrame) {
        if (actualPosition == endLocation) {
            cancelAnimationFrame(animationFrame);
            setTimeout(function () {
                flag = true;
            }, 2000);
        }
    };

    var flag = true; // bandera para detener o seguir
    var wheelMove = function wheelMove(sections, actualSectionInd) {
        var total = sections.length;
        window.addEventListener('wheel', function (e) {
            e.preventDefault();
            if (flag) {
                flag = false;
                var startLocation = sections[actualSectionInd]; // posición inicial
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
                var runAnimation = void 0; // guardará el animation frame
                var timeLapsed = 0; // acumulador del tiempo transcurrido
                var percentage = void 0,
                    position = void 0; // contenedores de las posiciones actuales y porcentaje avanzado
                var duration = 2000; // duración deseada
                var endLocation = sections[actualSectionInd]; // posición final
                var distance = endLocation - startLocation; // distancia entre ambas posiciones
                var animate = function animate() {
                    timeLapsed += 16;
                    percentage = timeLapsed / duration;
                    percentage = percentage > 1 ? 1 : percentage;
                    position = startLocation + distance * easing(percentage);
                    changeScroll(position);
                    runAnimation = requestAnimationFrame(animate);
                    changeStatus(position, endLocation, runAnimation);
                };
                runAnimation = requestAnimationFrame(animate);
                changeStatus();
            }
        });
    };
    wheelMove(sections, actualSection);
};

var stabilizeSection = function stabilizeSection(sections) {
    var startPos = getCurrentPosition();
    var finalPos = getActualSection(sections)[0];
    var actualSectionInd = getActualSection(sections)[1];
    console.log("Posición actual: ", startPos);
    console.log("Sección actual: ", actualSectionInd);
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
            setTimeout(function () {}, 2000);
        }
    };
    runAnimation = requestAnimationFrame(animate);
    return actualSectionInd;
};

var initWheelMovement = function initWheelMovement() {
    var sections = getSections();
    var actualSection = stabilizeSection(sections);
    wheelMovement(sections, actualSection);
};

initWheelMovement();

// wheelMovement(getSections());


// FALTA:
// Asignarle un evento a los botones de la barra de tareas para que te redirigan a la porción señalada.
// Asignarle el evento a los botones de alguans secciones para que te dirijan a la sección siguiente.