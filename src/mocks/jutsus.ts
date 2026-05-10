import type { Jutsu } from "@/types";

export const mockJutsus: Jutsu[] = [
export const mockJutsus: Jutsu[] = [
  // ===== Básicos — Estudante / Genin (Lv 1-10) =====
  { id: "j-bunshin", name: "Bunshin no Jutsu", type: "Ninjutsu", chakraCost: 10, cooldown: 1, baseDamage: 0, description: "Cria clones ilusórios para confundir o oponente.", requirements: { level: 1 } },
  { id: "j-henge", name: "Henge no Jutsu", type: "Ninjutsu", chakraCost: 8, cooldown: 1, baseDamage: 0, description: "Transforma a aparência do usuário.", requirements: { level: 1 } },
  { id: "j-kawarimi", name: "Kawarimi no Jutsu", type: "Ninjutsu", chakraCost: 12, cooldown: 2, baseDamage: 0, description: "Substitui o usuário por um objeto evitando dano.", requirements: { level: 1 } },
  { id: "j-kunai", name: "Kunai Throw", type: "Taijutsu", chakraCost: 0, cooldown: 0, baseDamage: 12, description: "Arremesso preciso de kunai.", requirements: { level: 1 } },
  { id: "j-shuriken-jutsu", name: "Shuriken Jutsu", type: "Taijutsu", chakraCost: 2, cooldown: 1, baseDamage: 16, description: "Múltiplas shurikens lançadas em sequência.", requirements: { level: 2 } },
  { id: "j-tai-combo", name: "Basic Taijutsu Combo", type: "Taijutsu", chakraCost: 5, cooldown: 1, baseDamage: 18, description: "Sequência de golpes corpo a corpo.", requirements: { level: 2 } },
  { id: "j-chakra-control", name: "Chakra Control", type: "Ninjutsu", chakraCost: 0, cooldown: 3, baseDamage: 0, description: "Restaura uma pequena quantidade de chakra.", requirements: { level: 3 } },
  { id: "j-makibishi", name: "Makibishi Trap", type: "Taijutsu", chakraCost: 3, cooldown: 2, baseDamage: 14, description: "Espalha estrepes que ferem o oponente.", requirements: { level: 4 } },
  { id: "j-iryo-basic", name: "Iryo: Cura Menor", type: "Iryo Ninjutsu", chakraCost: 18, cooldown: 3, baseDamage: -25, description: "Restaura uma pequena quantidade de HP.", requirements: { level: 5 } },
  { id: "j-bunshin-daibakuha", name: "Bunshin Daibakuha", type: "Ninjutsu", chakraCost: 22, cooldown: 3, baseDamage: 30, description: "Clone explosivo que detona próximo ao alvo.", requirements: { level: 6 } },
  { id: "j-katon-gokakyu", name: "Katon: Goukakyuu no Jutsu", type: "Ninjutsu", element: "Katon", chakraCost: 25, cooldown: 3, baseDamage: 45, description: "Bola de fogo massiva.", requirements: { level: 8 } },
  { id: "j-doton-doryuheki", name: "Doton: Doryuuheki", type: "Ninjutsu", element: "Doton", chakraCost: 22, cooldown: 3, baseDamage: 0, description: "Muralha de terra que aumenta defesa.", requirements: { level: 8 } },
  { id: "j-suiton-teppodama", name: "Suiton: Teppoudama", type: "Ninjutsu", element: "Suiton", chakraCost: 20, cooldown: 2, baseDamage: 38, description: "Projétil de água em alta pressão.", requirements: { level: 9 } },
  { id: "j-fuuton-renkudan", name: "Fuuton: Renkuudan", type: "Ninjutsu", element: "Fuuton", chakraCost: 22, cooldown: 3, baseDamage: 40, description: "Bala de ar comprimido.", requirements: { level: 10 } },
  { id: "j-suiton-ryudan", name: "Suiton: Suiryuudan no Jutsu", type: "Ninjutsu", element: "Suiton", chakraCost: 28, cooldown: 3, baseDamage: 48, description: "Dragão de água destrutivo.", requirements: { level: 10 } },

  // ===== Chunin (Lv 12-25) =====
  { id: "j-katon-housenka", name: "Katon: Housenka no Jutsu", type: "Ninjutsu", element: "Katon", chakraCost: 26, cooldown: 3, baseDamage: 50, description: "Várias bolas de fogo em rajada.", requirements: { level: 12 } },
  { id: "j-raiton-jibashi", name: "Raiton: Jibashi", type: "Ninjutsu", element: "Raiton", chakraCost: 24, cooldown: 3, baseDamage: 46, description: "Onda elétrica de curto alcance.", requirements: { level: 12 } },
  { id: "j-doton-iwayado", name: "Doton: Iwayado Kuzushi", type: "Ninjutsu", element: "Doton", chakraCost: 28, cooldown: 4, baseDamage: 52, description: "Quebra rochosa direcionada ao alvo.", requirements: { level: 14 } },
  { id: "j-genjutsu-magen", name: "Magen: Jubaku Satsu", type: "Genjutsu", chakraCost: 25, cooldown: 4, baseDamage: 30, description: "Ilusão que prende e fere mentalmente o oponente.", requirements: { level: 15 } },
  { id: "j-iryo-shosen", name: "Shousen Jutsu", type: "Iryo Ninjutsu", chakraCost: 30, cooldown: 4, baseDamage: -55, description: "Cura intermediária através do toque.", requirements: { level: 15 } },
  { id: "j-fuuton-daitoppa", name: "Fuuton: Daitoppa", type: "Ninjutsu", element: "Fuuton", chakraCost: 32, cooldown: 3, baseDamage: 55, description: "Lufada cortante de vento.", requirements: { level: 16 } },
  { id: "j-kuchiyose-toad", name: "Kuchiyose: Sapo Pequeno", type: "Kuchiyose", chakraCost: 35, cooldown: 5, baseDamage: 38, description: "Invoca um sapo aliado para ataque.", requirements: { level: 18 } },
  { id: "j-doton-doryudan", name: "Doton: Doryuudan", type: "Ninjutsu", element: "Doton", chakraCost: 34, cooldown: 4, baseDamage: 58, description: "Dragão de pedra cuspido contra o inimigo.", requirements: { level: 18 } },
  { id: "j-rasengan", name: "Rasengan", type: "Ninjutsu", chakraCost: 35, cooldown: 4, baseDamage: 65, description: "Esfera giratória de chakra concentrado.", requirements: { level: 20 } },
  { id: "j-chidori", name: "Chidori", type: "Ninjutsu", element: "Raiton", chakraCost: 35, cooldown: 4, baseDamage: 70, description: "Lança elétrica concentrada na mão.", requirements: { level: 20 } },
  { id: "j-suiton-suijinheki", name: "Suiton: Suijinheki", type: "Ninjutsu", element: "Suiton", chakraCost: 30, cooldown: 4, baseDamage: 0, description: "Muralha de água defensiva.", requirements: { level: 22 } },
  { id: "j-fuinjutsu-paper", name: "Fuinjutsu: Papel Bomba", type: "Fuinjutsu", chakraCost: 18, cooldown: 2, baseDamage: 48, description: "Selo explosivo arremessado no alvo.", requirements: { level: 22 } },
  { id: "j-katon-karyu", name: "Katon: Karyuu no Hou", type: "Ninjutsu", element: "Katon", chakraCost: 40, cooldown: 4, baseDamage: 72, description: "Lança-chamas em forma de dragão.", requirements: { level: 25 } },

  // ===== Tokubetsu Jounin / Jounin (Lv 28-50) =====
  { id: "j-raiton-raikiri", name: "Raiton: Raikiri", type: "Ninjutsu", element: "Raiton", chakraCost: 45, cooldown: 5, baseDamage: 85, description: "Versão aprimorada do Chidori.", requirements: { level: 28 } },
  { id: "j-genjutsu-kokoni", name: "Kokoni Arazu no Jutsu", type: "Genjutsu", chakraCost: 38, cooldown: 5, baseDamage: 50, description: "Faz o alvo perder a noção da própria localização.", requirements: { level: 30 } },
  { id: "j-iryo-chiyu", name: "Chiyu no Jutsu", type: "Iryo Ninjutsu", chakraCost: 50, cooldown: 5, baseDamage: -90, description: "Cura avançada de ferimentos profundos.", requirements: { level: 30 } },
  { id: "j-doton-doryu-taiga", name: "Doton: Doryuu Taiga", type: "Ninjutsu", element: "Doton", chakraCost: 42, cooldown: 4, baseDamage: 78, description: "Rio de lama que arrasta o oponente.", requirements: { level: 32 } },
  { id: "j-suiton-bakusui", name: "Suiton: Bakusui Shouha", type: "Ninjutsu", element: "Suiton", chakraCost: 48, cooldown: 5, baseDamage: 88, description: "Dilúvio devastador que inunda o campo.", requirements: { level: 34 } },
  { id: "j-fuuton-rasen", name: "Fuuton: Rasenshuriken", type: "Kinjutsu", element: "Fuuton", chakraCost: 60, cooldown: 6, baseDamage: 110, description: "Shuriken giratória de vento devastadora.", requirements: { level: 35 } },
  { id: "j-katon-gouenka", name: "Katon: Gouenka", type: "Ninjutsu", element: "Katon", chakraCost: 55, cooldown: 5, baseDamage: 100, description: "Múltiplas esferas de chamas concentradas.", requirements: { level: 38 } },
  { id: "j-kuchiyose-snake", name: "Kuchiyose: Cobra Gigante", type: "Kuchiyose", chakraCost: 60, cooldown: 6, baseDamage: 95, description: "Invoca uma serpente colossal.", requirements: { level: 40 } },
  { id: "j-doujutsu-sharingan", name: "Sharingan", type: "Doujutsu", chakraCost: 30, cooldown: 4, baseDamage: 0, description: "Ativa o olhar copiador, aumentando precisão e esquiva.", requirements: { level: 42 } },
  { id: "j-doujutsu-byakugan", name: "Byakugan", type: "Doujutsu", chakraCost: 28, cooldown: 4, baseDamage: 0, description: "Visão de 360° que ignora parte da defesa.", requirements: { level: 42 } },
  { id: "j-tai-omote-renge", name: "Omote Renge", type: "Taijutsu", chakraCost: 40, cooldown: 5, baseDamage: 105, description: "Combo aéreo devastador.", requirements: { level: 45 } },
  { id: "j-fuinjutsu-shishou", name: "Fuinjutsu: Shishou Fuuin", type: "Fuinjutsu", chakraCost: 55, cooldown: 6, baseDamage: 70, description: "Selo de quatro símbolos que enfraquece o alvo.", requirements: { level: 48 } },
  { id: "j-raiton-kirin", name: "Raiton: Kirin", type: "Kinjutsu", element: "Raiton", chakraCost: 70, cooldown: 7, baseDamage: 140, description: "Bestial trovão guiado das nuvens.", requirements: { level: 50 } },

  // ===== Elite Jounin / ANBU (Lv 55-75) =====
  { id: "j-katon-amaterasu", name: "Amaterasu", type: "Doujutsu", element: "Katon", chakraCost: 80, cooldown: 7, baseDamage: 160, description: "Chamas negras inextinguíveis do Mangekyou.", requirements: { level: 55 } },
  { id: "j-genjutsu-tsukuyomi", name: "Tsukuyomi", type: "Doujutsu", chakraCost: 75, cooldown: 7, baseDamage: 120, description: "Ilusão que tortura a mente do alvo por dias.", requirements: { level: 58 } },
  { id: "j-tai-ura-renge", name: "Ura Renge", type: "Kinjutsu", chakraCost: 65, cooldown: 7, baseDamage: 175, description: "Loto invertido — abre os portões internos.", requirements: { level: 60 } },
  { id: "j-senjutsu-mode", name: "Modo Sennin", type: "Senjutsu", chakraCost: 60, cooldown: 6, baseDamage: 0, description: "Reúne energia natural, ampliando todos os atributos.", requirements: { level: 62 } },
  { id: "j-doujutsu-amaterasu-blaze", name: "Enton: Kagutsuchi", type: "Doujutsu", element: "Katon", chakraCost: 90, cooldown: 8, baseDamage: 185, description: "Manipula as chamas negras em lâminas e correntes.", requirements: { level: 65 } },
  { id: "j-suiton-daibakufu", name: "Suiton: Daibakufu", type: "Ninjutsu", element: "Suiton", chakraCost: 80, cooldown: 7, baseDamage: 170, description: "Vórtice de água em escala colossal.", requirements: { level: 66 } },
  { id: "j-doton-yomi-numa", name: "Doton: Yomi Numa", type: "Ninjutsu", element: "Doton", chakraCost: 70, cooldown: 7, baseDamage: 90, description: "Pântano profundo que prende o alvo.", requirements: { level: 68 } },
  { id: "j-fuuton-shinkugyo", name: "Fuuton: Shinkuugyoku", type: "Ninjutsu", element: "Fuuton", chakraCost: 85, cooldown: 7, baseDamage: 180, description: "Esferas de vácuo perfurantes.", requirements: { level: 70 } },
  { id: "j-kuchiyose-gama", name: "Kuchiyose: Gamabunta", type: "Kuchiyose", chakraCost: 100, cooldown: 8, baseDamage: 200, description: "Invoca o sapo chefe armado de katana.", requirements: { level: 72 } },
  { id: "j-iryo-sozo-saisei", name: "Souzou Saisei", type: "Iryo Ninjutsu", chakraCost: 110, cooldown: 9, baseDamage: -200, description: "Regeneração total das células, restaura HP massivamente.", requirements: { level: 75 } },

  // ===== Kage Tier (Lv 80-100) =====
  { id: "j-kekkei-mokuton", name: "Mokuton: Jukai Kotan", type: "Kekkei Genkai", chakraCost: 120, cooldown: 9, baseDamage: 220, description: "Floresta de madeira viva domina o campo.", requirements: { level: 80 } },
  { id: "j-kekkei-hyoton", name: "Hyouton: Makyou Hyoushou", type: "Kekkei Genkai", chakraCost: 110, cooldown: 9, baseDamage: 210, description: "Espelhos de gelo que cercam o oponente.", requirements: { level: 82 } },
  { id: "j-kekkei-yoton", name: "Youton: Shakugaryuu", type: "Kekkei Genkai", element: "Katon", chakraCost: 130, cooldown: 9, baseDamage: 235, description: "Dragão de lava cuspido contra o inimigo.", requirements: { level: 85 } },
  { id: "j-doujutsu-susanoo", name: "Susano'o", type: "Doujutsu", chakraCost: 150, cooldown: 10, baseDamage: 260, description: "Avatar gigante de chakra que protege e ataca.", requirements: { level: 88 } },
  { id: "j-doujutsu-kamui", name: "Kamui", type: "Doujutsu", chakraCost: 140, cooldown: 10, baseDamage: 250, description: "Distorção espacial que sela parte do alvo em outra dimensão.", requirements: { level: 90 } },
  { id: "j-fuuton-bijuudama", name: "Bijuudama", type: "Kinjutsu", chakraCost: 200, cooldown: 12, baseDamage: 360, description: "Bola de chakra das Bestas com Cauda — devastação absoluta.", requirements: { level: 95 } },
  { id: "j-rikudou-chibaku", name: "Rikudou: Chibaku Tensei", type: "Kinjutsu", chakraCost: 220, cooldown: 12, baseDamage: 380, description: "Esfera gravitacional que esmaga tudo ao redor.", requirements: { level: 98 } },
  { id: "j-rinnegan-shinra", name: "Shinra Tensei", type: "Doujutsu", chakraCost: 180, cooldown: 11, baseDamage: 320, description: "Onda de repulsão gravitacional do Rinnegan.", requirements: { level: 100 } },
  { id: "j-kinjutsu-edo-tensei", name: "Edo Tensei", type: "Kinjutsu", chakraCost: 250, cooldown: 14, baseDamage: 0, description: "Reanimação proibida — invoca um aliado caído por turnos.", requirements: { level: 100 } },
];
