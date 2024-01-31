const MARGEN_ANIMACION = 0;                               // Margen en 'px' desde la entrada y salida del contendedor hasta el comienzo de la mismo
const PORCENTAJE_TOTAL_ENTRADA = 0.01;                      // Porcentaje del Total de la Animación reservado a la Entrada de los Elementos
const PORCENTAJE_TOTAL_SALIDA = 0.15;                       // Porcentaje del Total de la Animación reservado a la Salida de los Elementos
const WIDTH_INICIAL = 10;                                   // Ancho Inicial de los colores el porcentajes ( width : xx%; )
const WIDTH_FINAL = 40;                                     // Ancho Final de los colores el porcentajes ( width : xx%; )
const PORCENTAJE_TO_RESIZE = 0.3;                           // Porcentaje de la Animación de cada color reservado para el redimensionamiento de los colores
const PORCENTAJE_INFO_IS_SHOWN = 0.3;                       // Porcentaje de la animación cada color en la cual la información del color será visible
const CRECIMIENTO_EXPONENCIAL_ACTION = 4;                   // Indice de curvatura de la animación de resize de los colores
const MARGEN_INICIAL_SALIDA = 0.2;                          // Porcentaje de la animación de Salida en la que esta no hará nada
const VALORES_INICIALES_SALIDA = { scale: 1, left: 50 };    // Valores Iniciales de la animación de salida
const VALORES_FINALES_SALIDA = { scale: 14, left: 410 };    // Valores Finales de la animación de salida
const CRECIMIENTO_EXPONENCIAL_SALIDA = 9;                   // Indice de curvatura de la animación de zoom in de la salida

document.addEventListener('scroll', setPaletteAnimation);
document.addEventListener('DOMContentLoaded', setPaletteAnimation);

function setPaletteAnimation(){
    const porcentajeScrollParentContainer = getScrollPercentajeInParentContainer()
    requestAnimationFrame(() => controlFasedeAnimación(porcentajeScrollParentContainer));
}

function getScrollPercentajeInParentContainer(){
    const parentContainer = document.querySelector('.container-color-palette');
    const porcentajeReal = (window.scrollY - parentContainer.offsetTop - MARGEN_ANIMACION) / (parentContainer.offsetHeight - window.innerHeight - (MARGEN_ANIMACION /* * 2*/));
    const porcentajeNormalizado  = (porcentajeReal < 0) ? 0 : (porcentajeReal > 1) ? 1 : porcentajeReal
    return porcentajeNormalizado;
}

function controlFasedeAnimación(porcentajeTotalScroll){
    const isEnteringActive = porcentajeTotalScroll < PORCENTAJE_TOTAL_ENTRADA;
    const isActionActive = porcentajeTotalScroll > PORCENTAJE_TOTAL_ENTRADA && porcentajeTotalScroll < (1 - PORCENTAJE_TOTAL_SALIDA);
    const isExitingActive = porcentajeTotalScroll > (1 - PORCENTAJE_TOTAL_SALIDA);
    isEnteringActive && enteringAnimation(porcentajeTotalScroll);
    isActionActive && actionAnimation(porcentajeTotalScroll);
    isExitingActive && exitingAnimation(porcentajeTotalScroll);
}

function actionAnimation(porcentajeTotalScroll){
    normaliceAllColors();
    const paletteColors = Array.from(document.querySelectorAll('.palette-color'));
    const porcentajeRelToAction = (porcentajeTotalScroll - PORCENTAJE_TOTAL_ENTRADA) / (1 - PORCENTAJE_TOTAL_ENTRADA - PORCENTAJE_TOTAL_SALIDA);
    const indexPaletteColorInAnimation = Math.floor(porcentajeRelToAction * paletteColors.length)
    const porcentajeRelToColor = (porcentajeRelToAction - ((1 / paletteColors.length) * indexPaletteColorInAnimation)) / (1 / paletteColors.length);
    const marginBetweenResizeInfo = (1 - (PORCENTAJE_INFO_IS_SHOWN + (PORCENTAJE_TO_RESIZE * 2))) / 2;
    const isShowingInfo = porcentajeRelToColor > (PORCENTAJE_TO_RESIZE + marginBetweenResizeInfo) && porcentajeRelToColor < (1 - (marginBetweenResizeInfo + PORCENTAJE_TO_RESIZE));
    const isInResize = porcentajeRelToColor < PORCENTAJE_TO_RESIZE || porcentajeRelToColor > (1 - PORCENTAJE_TO_RESIZE);
    paletteColors[indexPaletteColorInAnimation].style.width = `${(isInResize ? calcularWidthColor(porcentajeRelToColor, WIDTH_INICIAL, WIDTH_FINAL) : WIDTH_FINAL)}%`;
    paletteColors[indexPaletteColorInAnimation].querySelector('.color-display-info').classList.toggle('color-info-in', isShowingInfo);
    paletteColors.forEach(color => color != paletteColors[indexPaletteColorInAnimation] && (color.style.width = `${WIDTH_INICIAL}%`));
    
}

const calcularWidthColor = (porcentajeRelToColor, widthInicial, widthFinal) => 
    porcentajeRelToColor < PORCENTAJE_TO_RESIZE ? 
    widthInicial + (widthFinal - widthInicial) * Math.pow((porcentajeRelToColor / PORCENTAJE_TO_RESIZE), CRECIMIENTO_EXPONENCIAL_ACTION) :
    widthFinal - ((widthFinal - widthInicial) * (1 - Math.pow(((1 - porcentajeRelToColor) / PORCENTAJE_TO_RESIZE), CRECIMIENTO_EXPONENCIAL_ACTION)));

function exitingAnimation(porcentajeTotalScroll){
    normaliceAllColors();
    const paletteContainer = document.querySelector('.palette-container');
    const porcentajeRelToExit = (porcentajeTotalScroll - (1 - PORCENTAJE_TOTAL_SALIDA)) / PORCENTAJE_TOTAL_SALIDA;
    porcentajeRelToExit > MARGEN_INICIAL_SALIDA ? setExitingStyleValues(porcentajeRelToExit) : paletteContainer.removeAttribute('style');
}

function setExitingStyleValues(porcentajeRelToExit){
    const paletteContainer = document.querySelector('.palette-container');
    paletteContainer.style.transform = `translate(-50%, -50%) scale(${VALORES_INICIALES_SALIDA.scale + (VALORES_FINALES_SALIDA.scale - VALORES_INICIALES_SALIDA.scale) * Math.pow((porcentajeRelToExit - MARGEN_INICIAL_SALIDA) / (1 - MARGEN_INICIAL_SALIDA), CRECIMIENTO_EXPONENCIAL_SALIDA)}`;
    paletteContainer.style.left = `${VALORES_INICIALES_SALIDA.left + (VALORES_FINALES_SALIDA.left - VALORES_INICIALES_SALIDA.left) * Math.pow((porcentajeRelToExit - MARGEN_INICIAL_SALIDA) / (1 - MARGEN_INICIAL_SALIDA), CRECIMIENTO_EXPONENCIAL_SALIDA)}%`;
}

function normaliceAllColors(){
    const paletteColors = document.querySelectorAll('.palette-color');
    for (const color of paletteColors) {
        color.style.width = `${WIDTH_INICIAL}%`
        color.querySelector('.color-display-info').classList.remove('color-info-in')
    }
    document.querySelector('.palette-container').removeAttribute('style')
}

function enteringAnimation(porcentajeTotalScroll){
    const porcentajeRelToEnter = porcentajeTotalScroll / PORCENTAJE_TOTAL_ENTRADA;
    normaliceAllColors()
    // Todo preparado para una futura animación de entrada...


}