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

// Retorna la sección sobre la cual se está actualmente
const getActualSection = (sections) => {
    let actualScroll = getCurrentPosition();
    for (let i = 0; i < sections.length - 1; i++) {
        let difference = Math.floor((sections[i] + sections[i+1]) / 2) ;
        if (actualScroll <  difference) {
            return [sections[i], i];
        }
    }
    return [sections[sections.length-1], sections.length-1];
};

// Retorna todas las posiciones de las secciones escogidas, en un array
const getSections = () => {
    let e1 = document.getElementById('header');
    let e2 = document.getElementById('about');
    let e3 = document.getElementById('skills');
    let e4 = document.getElementById('works');
    let e5 = document.getElementById('contact');
    let e6 = document.getElementById('footer');
    return [getElementPosition(e1),
        getElementPosition(e2),
        getElementPosition(e3),
        getElementPosition(e4),
        getElementPosition(e5),
        getElementPosition(e6)];
};

// Función que simula el "easing"
const easing = function(progress) {
    return progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;    
}

// Evento para la rueda del ratón
const wheelMovement = (sections, actualSection) => {
    
    // Cambiar el estado de la bandera del evento rueda del ratón
    const changeStatus = (actualPosition, endLocation, animationFrame) => {
        if (actualPosition == endLocation) {
            cancelAnimationFrame(animationFrame);
            setTimeout(function () {
                flag = true;
            }, 2000);  
        }
    };

    let flag = true; // bandera para detener o seguir
    const wheelMove = (sections, actualSectionInd) => {
        let total = sections.length;
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (flag) {
                flag = false;
                let startLocation = sections[actualSectionInd]; // posición inicial
                if (e.deltaY > 0) {
                    ++actualSectionInd;
                } else {
                    if (actualSectionInd != 0) {
                        --actualSectionInd;
                    }else {
                        actualSectionInd = total - 1;
                    }
                }
                actualSectionInd = actualSectionInd % total;
                let runAnimation; // guardará el animation frame
                let timeLapsed = 0; // acumulador del tiempo transcurrido
                let percentage, position; // contenedores de las posiciones actuales y porcentaje avanzado
                let duration = 2000; // duración deseada
                let endLocation = sections[actualSectionInd]; // posición final
                let distance = endLocation - startLocation; // distancia entre ambas posiciones
                const animate = () => {
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

const stabilizeSection = (sections) => {
    let startPos = getCurrentPosition();
    let finalPos = getActualSection(sections)[0];
    let actualSectionInd = getActualSection(sections)[1];
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
    return actualSectionInd;
};

const initWheelMovement = () => {
    let sections = getSections();
    let actualSection = stabilizeSection(sections);
    wheelMovement(sections, actualSection);
};

initWheelMovement();


// wheelMovement(getSections());


// FALTA:
// Asignarle un evento a los botones de la barra de tareas para que te redirigan a la porción señalada.
// Asignarle el evento a los botones de alguans secciones para que te dirijan a la sección siguiente.