export const checkColorUnitsMoreThanZero = (
  colorUnits: Map<string, number>
): boolean => {
  // Convertimos el iterador a un arreglo y usamos 'some' para verificar la condición
  return Array.from(colorUnits.values()).some((value) => value > 0);
};
