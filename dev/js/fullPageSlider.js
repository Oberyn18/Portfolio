// Retorna la posición actual del scroll
const getCurrentPosition = () => document.scrollingElement.scrollTop;

// Retorna la posición del elemento respecto al body, es decir, en toda la página
const getElementPosition = element => {
    return element.offsetTop;
};

// Asigna al scroll una nueva posición, pasada por parámetro
const changeScroll = (newPos) => {
    document.scrollingElement.scrollTop = newPos;
};

// Retorna el índice de la sección sobre la cual se está actualmente
const getActualSectionInd = (sections) => {
    let actualScroll = getCurrentPosition();
    // Itero hasta el penúltimo, ya que lo que quiero son las diferencias entre los consecutivos (y llegaré al último de todas formas)
    for (let i = 0; i < sections.length - 1; i++) {
        // El promedio de las posiciones de las seccion consecutivas es la posición de la mitad entre dichas secciones
        let medianPos = Math.floor((sections[i][1] + sections[i+1][1]) / 2) ;
        if (actualScroll <  medianPos) {
            // Si no paso esa mitad, estoy donde debo estar, pues las posiciones las estoy recorriendo en orden ascendente.
            return i;
        }
    }
    // Si nunca estuve antes de la diferencia entre las consecutivas, debo estar al final de todo.
    return sections.length - 1;
};

// Recibe el nombre de los Id's de las secciones y retorna todas las secciones y sus posiciones, en un array bidimensional
const getSections = (sectionsIds) => {
    let sections = new Array();
    for (let sectionId of sectionsIds) {
        let e = document.getElementById(sectionId);
        let position = getElementPosition(e);
        sections.push([e, position]);
    }
    return sections;
};

// Función que simula el "easing"
const easing = function(progress) {
    return progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;    
}

// Esta bandera activará y desactivará el scroll con el mouse en el evento siguiente, se define ahora porque animatedScrolling la usa
let flag = false;
const animatedScrolling = (startPos, finalPos, waitTime) => {
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
                flag = true;
            }, waitTime);  
        }
    };
    runAnimation = requestAnimationFrame(animate);
};

const fullPageSlider = () => {
    // Esta variable (sectionsNames) se debe sobreescribir siempre que se use este slider en distintos proyectos.
    let sectionsNames = ['header', 'about', 'skills', 'works', 'contact', 'footer'];
    // Contiene pares (elementoHTML, posición en Y) sobre los cuales haremos el scroll
    let sections = getSections(sectionsNames);
    // Índice de la sección que debería ocupar el viewport actualmente
    let actualSectionInd = getActualSectionInd(sections);
    // Posición actual
    let startPos = getCurrentPosition();
    // Posición final (posición que debería estar ocupando el viewport)
    let endPos = sections[actualSectionInd][1];
    // Animar el movimiento de la posición actual a la posición indicada.
    animatedScrolling(startPos, endPos, 500);
    // ----- EVENTO PARA LA RUEDA DEL RATÓN
    // Total de secciones
    let total = sections.length;
    window.addEventListener('wheel', (e) => {
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
                }else {
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


// FALTA:
// Asignarle un evento a los botones de la barra de tareas para que te redirigan a la porción señalada.
// Asignarle el evento a los botones de alguans secciones para que te dirijan a la sección siguiente.