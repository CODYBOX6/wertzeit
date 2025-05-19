"use client";

import React from "react";
import { BentoCell, BentoGrid, ContainerScale, ContainerScroll } from "./ui/hero-gallery-scroll-animation";
import { Button } from "./ui/button";

// Images représentant les domaines d'expertise
const EXPERTISE_IMAGES = [
  "/technique.jpg", // Image représentant la technique/développement
  "/design.jpg",    // Image représentant le design minimaliste
  "/storytelling.jpg", // Image représentant le storytelling
  "/photo-leica.jpg",  // Image représentant la photographie
];

// Images de remplacement au cas où les images personnalisées ne sont pas disponibles
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",  // Code/développement
  "https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=2070&auto=format&fit=crop", // Design minimaliste
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop", // Storytelling
  "https://images.unsplash.com/photo-1617025812609-af7939a27dfb?q=80&w=2070&auto=format&fit=crop", // Appareil photo Leica
];

// Informations sur les domaines d'expertise
const EXPERTISE_DATA = [
  {
    title: "Technique",
    description: "Développement en JavaScript, Vue.js et React. Hébergement Netlify/Vercel."
  },
  {
    title: "Design",
    description: "Approche minimaliste inspirée du Swiss Design et du nombre d'or."
  },
  {
    title: "Storytelling",
    description: "Mise en récit de votre histoire pour créer un lien émotionnel avec votre audience."
  },
  {
    title: "Photographie",
    description: "Photos professionnelles avec Leica Q3 qui mettent en valeur votre projet."
  }
];

const ExpertiseGallery = () => {
  // Fonction pour obtenir l'URL de l'image en vérifiant d'abord si l'image personnalisée existe
  const getImageUrl = (index: number) => {
    // Pour simplification, on utilise directement les images de remplacement
    // Dans un environnement réel, on pourrait vérifier l'existence des images personnalisées
    return FALLBACK_IMAGES[index] || FALLBACK_IMAGES[0];
  };

  return (
    <ContainerScroll className="h-[350vh] bg-[var(--primary)]">
      <BentoGrid
        variant="fourCells"
        className="sticky left-0 top-0 h-svh w-full p-4"
      >
        {EXPERTISE_DATA.map((expertise, index) => (
          <BentoCell
            key={index}
            className="overflow-hidden rounded-xl shadow-xl"
          >
            <img
              className="size-full object-cover object-center"
              width="100%"
              height="100%"
              src={getImageUrl(index)}
              alt={expertise.title}
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">{expertise.title}</h3>
            </div>
          </BentoCell>
        ))}
      </BentoGrid>
      
      <ContainerScale className="text-center">
        <h1 className="max-w-xl text-5xl font-bold tracking-tighter text-main">
          Mes Expertises
        </h1>
        <p className="my-6 max-w-xl text-sm text-white/90 md:text-base">
          Découvrez mes domaines d'expertise avec une approche interactive.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button className="bg-main hover:bg-main-light px-4 py-2 font-medium">
            Discutons de votre projet
          </Button>
          <Button
            variant="link"
            className="bg-transparent px-4 py-2 font-medium text-white"
          >
            En savoir plus
          </Button>
        </div>
      </ContainerScale>
    </ContainerScroll>
  );
};

export default ExpertiseGallery; 