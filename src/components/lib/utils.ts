/**
 * Fonction utilitaire qui combine les classes conditionnellement
 * Filtre les valeurs falsy et joint les classes avec un espace
 */
export function cn(...classes: any) {
  return classes.filter(Boolean).join(' ')
} 