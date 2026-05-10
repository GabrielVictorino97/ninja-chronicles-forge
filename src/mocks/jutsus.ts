import type { Jutsu } from "@/types";

export const mockJutsus: Jutsu[] = [
  { id: "j-bunshin", name: "Bunshin no Jutsu", type: "Ninjutsu", chakraCost: 10, cooldown: 1, baseDamage: 0, description: "Cria clones ilusórios para confundir o oponente.", requirements: { level: 1 } },
  { id: "j-henge", name: "Henge no Jutsu", type: "Ninjutsu", chakraCost: 8, cooldown: 1, baseDamage: 0, description: "Transforma a aparência do usuário.", requirements: { level: 1 } },
  { id: "j-kawarimi", name: "Kawarimi no Jutsu", type: "Ninjutsu", chakraCost: 12, cooldown: 2, baseDamage: 0, description: "Substitui o usuário por um objeto evitando dano.", requirements: { level: 1 } },
  { id: "j-kunai", name: "Kunai Throw", type: "Taijutsu", chakraCost: 0, cooldown: 0, baseDamage: 12, description: "Arremesso preciso de kunai.", requirements: { level: 1 } },
  { id: "j-tai-combo", name: "Basic Taijutsu Combo", type: "Taijutsu", chakraCost: 5, cooldown: 1, baseDamage: 18, description: "Sequência de golpes corpo a corpo.", requirements: { level: 2 } },
  { id: "j-chakra-control", name: "Chakra Control", type: "Ninjutsu", chakraCost: 0, cooldown: 3, baseDamage: 0, description: "Restaura uma pequena quantidade de chakra.", requirements: { level: 3 } },
  { id: "j-rasengan", name: "Rasengan", type: "Ninjutsu", chakraCost: 35, cooldown: 4, baseDamage: 65, description: "Esfera giratória de chakra concentrado.", requirements: { level: 20 } },
  { id: "j-chidori", name: "Chidori", type: "Ninjutsu", element: "Raiton", chakraCost: 35, cooldown: 4, baseDamage: 70, description: "Lança elétrica concentrada na mão.", requirements: { level: 20 } },
  { id: "j-katon-gokakyu", name: "Katon: Goukakyuu no Jutsu", type: "Ninjutsu", element: "Katon", chakraCost: 25, cooldown: 3, baseDamage: 45, description: "Bola de fogo massiva.", requirements: { level: 8 } },
  { id: "j-suiton-ryudan", name: "Suiton: Suiryuudan no Jutsu", type: "Ninjutsu", element: "Suiton", chakraCost: 28, cooldown: 3, baseDamage: 48, description: "Dragão de água destrutivo.", requirements: { level: 10 } },
  { id: "j-doton-doryuheki", name: "Doton: Doryuuheki", type: "Ninjutsu", element: "Doton", chakraCost: 22, cooldown: 3, baseDamage: 0, description: "Muralha de terra que aumenta defesa.", requirements: { level: 8 } },
  { id: "j-fuuton-rasen", name: "Fuuton: Rasenshuriken", type: "Kinjutsu", element: "Fuuton", chakraCost: 60, cooldown: 6, baseDamage: 110, description: "Shuriken giratória de vento devastadora.", requirements: { level: 35 } },
  { id: "j-raiton-raikiri", name: "Raiton: Raikiri", type: "Ninjutsu", element: "Raiton", chakraCost: 45, cooldown: 5, baseDamage: 85, description: "Versão aprimorada do Chidori.", requirements: { level: 28 } },
];
