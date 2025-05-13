"use client";

import { User, Zap, Rocket, ShieldCheck, Settings } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "🧑‍💻 Qui ?",
    date: "",
    content: "Sonny Callegaro, développeur full-stack & photographe suisse à Genève. 🇨🇭\nÉtudiant en 3ème année à la HEG, je fusionne ingénieurie logicielle et art minimaliste au profit de la sécurité et du confort d'utilisation. 🌌\nJe suis également Président de l'association étudiante de mon université -> je saisis vite les besoins des PME et indépendants. 📈",
    category: "",
    icon: User,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "💡 Approche",
    date: "",
    content: "Je crée des solutions web épurées centrées sur VOTRE histoire.\nFini les templates génériques et plateformes dépassées (WordPress, Wix...). Sites 100% code: rapides, sûrs, uniques.",
    category: "",
    icon: Zap,
    relatedIds: [1, 3, 4],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "🚀 Rapidité",
    date: "",
    content: "⚡ Site ultra-rapide, optimisé mobile (loin devant la concurrence Wordpress).\n🚀 Premier déploiement fonctionnel sous 24-72h.\n📸 Shooting photo sur place avec Leica Q3 inclus.",
    category: "Atouts",
    icon: Rocket,
    relatedIds: [1, 2, 4, 5],
    status: "in-progress" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "🛡️ Sécurité",
    date: "",
    content: "🔒 Expertise cybersécurité: Chiffrement SSL, HTTPS, protection XSS, SQL Injection... Adieu failles WordPress !\n⚖️ Conformité LPD suisse garantie sur toutes les offres.",
    category: "",
    icon: ShieldCheck,
    relatedIds: [2, 3, 5],
    status: "in-progress" as const,
    energy: 75,
  },
  {
    id: 5,
    title: "🤝 Maintenance",
    date: "",
    content: "🦾 Maintenance simplifiée, modifications visibles instantanément. Code 100% portable et évolutif.\n🕊️ Aucune dépendance technologique ni abonnement caché.\n🇨🇭 Prix unique et transparent pour un travail de qualité durable. Pas de coûts cachés, pas de suppléments.",
    category: "",
    icon: Settings,
    relatedIds: [3, 4],
    status: "pending" as const,
    energy: 70,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <>
      <RadialOrbitalTimeline timelineData={timelineData} />
    </>
  );
}

// Removing the problematic default export
// export default {
//   RadialOrbitalTimelineDemo,
// }; 