const SOURCES = ['palmods-work-suitability', 'palworld-calc-1-0-tier-list', 'video-ragegaming-true-best-base-pals'];

const BASE_PLANS = {
  1: {
    baseCount: 1,
    title: 'Eine Base: kompakter Allrounder',
    summary: 'Halte die Wege kurz und besetze zuerst die Engpässe: Nahrung, Erz, Handwerk und Transport.',
    bases: [{ name: 'Allround-Produktion', purpose: 'Eine zentrale Base für Fortschritt und tägliche Versorgung.', workers: ['Anubis · Handiwork / Übergang', 'Knocklem · Transporting / Mining', 'Orserk · Electricity', 'Lyleen · Planting / Versorgung'], buildings: 'Palbox, Erz- oder Steinbrunnen, Plantage, Ranch, Breeding Farm, Kühler, Öfen, Produktionslinien und mindestens ein Lager je Arbeitsbereich.', note: 'Im Endgame Spezialisten nachrüsten; nicht jede Aufgabe gleichzeitig maximal ausbauen.', sources: SOURCES }]
  },
  2: {
    baseCount: 2,
    title: 'Zwei Basen: Produktion + Zucht',
    summary: 'Die beste Standardaufteilung: eine Base produziert dauerhaft, die zweite hält Zucht, Ranch und Inkubation frei von Produktionsverkehr.',
    bases: [
      { name: 'Produktionsbase', purpose: 'Erz, Strom, Nahrung und Fertigung mit kurzen Laufwegen.', workers: ['1× Aegidron · Mining 8', '1× Orserk · Electricity', '1× Renjishi · Kindling 8', '1× Solenne · Handiwork 8', '2× Dandilord · Planting 8', '2× Shaolong · Watering 8', '2× Knocklem · Transporting'], buildings: 'Erzbrunnen, 2× Beerenplantage, 2× Salatplantage, Kühler, Öfen, Assembly Lines, Medizin- und Lagerbereich.', note: 'Beeren sichern das Worker-Futter; Salat ist das Arbeits-Food. Diese Base braucht keine Kuchen-Ranch.', sources: SOURCES },
      { name: 'Breeding- & Ranchbase', purpose: 'Kuchen, Ranch-Drops, Zuchtfarm und Inkubatoren ohne Produktionschaos.', workers: ['2× Chikipi · Ranch für Eier', '2× Mozzarina · Ranch für Milch', '2× Beegarde · Ranch für Honig', '1–2× Dandilord · Planting', '1× Shaolong · Watering', '1× Renjishi · Kuchenproduktion', '1× Bastigor · Cooling', '1–2× Knocklem · Transporting'], buildings: 'Mehrere Breeding Farms, 2× Weizenplantage, 1× Beerenplantage, 3× getrennte Ranches (Eier/Milch/Honig), Küche, Inkubatoren, Kühler und ein zentrales Lager.', note: 'Kuchenproduktion: Weizen → Mehl plus Beeren; Eier, Milch und Honig kommen aus den drei getrennten Ranches. Zuchteltern nur mit gewünschten Passives/Talenten verwenden.', sources: SOURCES }
    ]
  },
  3: {
    baseCount: 3,
    title: 'Drei Basen: spezialisiert und wartungsarm',
    summary: 'Die Endgame-Aufteilung trennt permanente Produktion, Ressourcenabbau und Zucht. Das reduziert Laufwege und Konkurrenz zwischen Jobs.',
    bases: [
      { name: 'Produktionsbase', purpose: 'Dauerhafte Fertigung und Nahrung.', workers: ['Solenne · Handiwork 8', 'Renjishi · Kindling 8', 'Orserk · Electricity', 'Dandilord · Planting 8', 'Silvance · Medicine 8', 'Knocklem · Transporting'], buildings: 'Produktionslinien, Öfen, Medizin, Plantagen, Kühler und Lagerzonen.', note: 'Food- und Transportkapazität zuerst stabilisieren.', sources: SOURCES },
      { name: 'Ressourcenbase', purpose: 'Erz, Kohle, Holz und Öl dauerhaft farmen.', workers: ['Aegidron · Mining 8', 'Knocklem · Mining / Transporting', 'Celesdir Noct · Lumbering 8', 'Orserk · Electricity', 'Shaolong · Watering 8'], buildings: 'Ressourcenbrunnen, Lager, Strom, Reparatur-/Food-Bereich und möglichst direkte Laufwege.', note: 'Standort nach Ressourcen wählen; eine Meta-Worker-Liste ersetzt keine gute Platzierung.', sources: SOURCES },
      { name: 'Breeding- & Ranchbase', purpose: 'Kuchen, Ranch-Drops, Zucht und Inkubation im Durchlauf.', workers: ['Dandilord · Planting 8', 'Renjishi · Kindling 8', 'Bastigor · Cooling 8', 'Knocklem · Transporting', 'Ranch-Pal nach Drop-Ziel'], buildings: 'Breeding Farms, Ranches, Plantagen, Küche, Inkubatoren, Kühler und Lager.', note: 'Bei Zuchtketten jede Generation prüfen; nicht blind alte Paarungen aus früheren Patches übernehmen.', sources: SOURCES }
    ]
  }
};

export { BASE_PLANS };
export function getBasePlan(baseCount) {
  const count = Math.min(3, Math.max(1, Number(baseCount) || 1));
  return BASE_PLANS[count];
}
