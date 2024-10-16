// deno-lint-ignore-file no-explicit-any no-unused-vars


import { join } from "https://deno.land/std@0.119.0/path/mod.ts";

import sortArray from 'sort-array';

import { join as arrayJoin } from '@mathigon/core'
import { mean, median, mode, stdDev, variance } from '@mathigon/fermat'
 
// Function to import data from a specific folder path
async function importDataFromPath(folderPath: string): Promise<any[]> {
  const filePath = join(folderPath, "data.json");
  try {
    const jsonData = await Deno.readTextFile(filePath);
    const parsedData = JSON.parse(jsonData);
    
    // Map the "prices" array into a structured format
    return parsedData.prices.map((priceData: any) => ({
      date: priceData[0],
      price: priceData[1],
      amount: priceData[2],
    }));
  } catch (error) {
    // Assert that error is of type 'Error' to access the message property
    if (error instanceof Error) {
      console.error(`Error reading data from ${filePath}:`, error.message);
    } else {
      console.error(`Unknown error occurred while reading data from ${filePath}`);
    }
    return [];
  }
}

// ----- Stmarc Collection -----
// Gray Group
const bambooGardenPath = "./data/raw/stmarc/gray/BambooGarden";
const junglePath = "./data/raw/stmarc/gray/Jungle";
const jungleThicketPath = "./data/raw/stmarc/gray/JungleThicket";
const seabirdPath = "./data/raw/stmarc/gray/Seabird";
const surfwoodPath = "./data/raw/stmarc/gray/Surfwood";

const BambooGarden = await importDataFromPath(bambooGardenPath);
const Jungle = await importDataFromPath(junglePath);
const JungleThicket = await importDataFromPath(jungleThicketPath);
const Seabird = await importDataFromPath(seabirdPath);
const Surfwood = await importDataFromPath(surfwoodPath);

// Lightblue Group
const bananaLeafPath = "./data/raw/stmarc/lightblue/BananaLeaf";
const darkBlossomPath = "./data/raw/stmarc/lightblue/DarkBlossom";
const rustLeafPath = "./data/raw/stmarc/lightblue/RustLeaf";
const sunsetLilyPath = "./data/raw/stmarc/lightblue/SunsetLily";

const BananaLeaf = await importDataFromPath(bananaLeafPath);
const DarkBlossom = await importDataFromPath(darkBlossomPath);
const RustLeaf = await importDataFromPath(rustLeafPath);
const SunsetLily = await importDataFromPath(sunsetLilyPath);

// Blue Group
const crimsonBlossomPath = "./data/raw/stmarc/blue/CrimsonBlossom";
const dayLilyPath = "./data/raw/stmarc/blue/DayLily";
const sundownPath = "./data/raw/stmarc/blue/Sundown";
const tealBlossomPath = "./data/raw/stmarc/blue/TealBlossom";

const CrimsonBlossom = await importDataFromPath(crimsonBlossomPath);
const DayLily = await importDataFromPath(dayLilyPath);
const Sundown = await importDataFromPath(sundownPath);
const TealBlossom = await importDataFromPath(tealBlossomPath);

// Purple Group
const midnightLilyPath = "./data/raw/stmarc/purple/MidnightLily";
const seaCalicoPath = "./data/raw/stmarc/purple/SeaCalico";
const synthLeafPath = "./data/raw/stmarc/purple/SynthLeaf";

const MidnightLily = await importDataFromPath(midnightLilyPath);
const SeaCalico = await importDataFromPath(seaCalicoPath);
const SynthLeaf = await importDataFromPath(synthLeafPath);

// ----- Canals Collection -----
// Gray Group
const boroqueSandPath = "./data/raw/canals/gray/BoroqueSand";
const canalSprayPath = "./data/raw/canals/gray/CanalSpray";
const indigoPath = "./data/raw/canals/gray/Indigo";
const navyMuranoPath = "./data/raw/canals/gray/NavyMurano";
const stoneMosaicoPath = "./data/raw/canals/gray/StoneMosaico";

const BoroqueSand = await importDataFromPath(boroqueSandPath);
const CanalSpray = await importDataFromPath(canalSprayPath);
const Indigo = await importDataFromPath(indigoPath);
const NavyMurano = await importDataFromPath(navyMuranoPath);
const StoneMosaico = await importDataFromPath(stoneMosaicoPath);

// Lightblue Group
const baroquePurplePath = "./data/raw/canals/lightblue/BaroquePurple";
const candyApplePath = "./data/raw/canals/lightblue/CandyApple";
const darkFiligreePath = "./data/raw/canals/lightblue/DarkFiligree";
const orangeMuranoPath = "./data/raw/canals/lightblue/OrangeMurano";

const BaroquePurple = await importDataFromPath(baroquePurplePath);
const CandyApple = await importDataFromPath(candyApplePath);
const DarkFiligree = await importDataFromPath(darkFiligreePath);
const OrangeMurano = await importDataFromPath(orangeMuranoPath);

// Blue Group
const baroqueRedPath = "./data/raw/canals/blue/BaroqueRed";
const emeraldPath = "./data/raw/canals/blue/Emerald";
const orangeFiligreePath = "./data/raw/canals/blue/OrangeFiligree";
const violetMuranoPath = "./data/raw/canals/blue/VioletMurano";

const BaroqueRed = await importDataFromPath(baroqueRedPath);
const Emerald = await importDataFromPath(emeraldPath);
const OrangeFiligree = await importDataFromPath(orangeFiligreePath);
const VioletMurano = await importDataFromPath(violetMuranoPath);

// Purple Group
const baroqueOrangePath = "./data/raw/canals/purple/BaroqueOrange";
const redFiligreePath = "./data/raw/canals/purple/RedFiligree";
const stainedGlassPath = "./data/raw/canals/purple/StainedGlass";

const BaroqueOrange = await importDataFromPath(baroqueOrangePath);
const RedFiligree = await importDataFromPath(redFiligreePath);
const StainedGlass = await importDataFromPath(stainedGlassPath);

// ----- Norse Collection -----
// Gray Group
const barricadePath = "./data/raw/norse/gray/Barricade";
const nightBorrePath = "./data/raw/norse/gray/NightBorre";
const redStonePath = "./data/raw/norse/gray/RedStone";
const scorchedPath = "./data/raw/norse/gray/Scorched";
const tornadoPath = "./data/raw/norse/gray/Tornado";

const Barricade = await importDataFromPath(barricadePath);
const NightBorre = await importDataFromPath(nightBorrePath);
const RedStone = await importDataFromPath(redStonePath);
const Scorched = await importDataFromPath(scorchedPath);
const Tornado = await importDataFromPath(tornadoPath);

// Lightblue Group
const chainmailPath = "./data/raw/norse/lightblue/Chainmail";
const mossQuartzPath = "./data/raw/norse/lightblue/MossQuartz";
const pathfinderPath = "./data/raw/norse/lightblue/Pathfinder";
const pyrePath = "./data/raw/norse/lightblue/Pyre";

const Chainmail = await importDataFromPath(chainmailPath);
const MossQuartz = await importDataFromPath(mossQuartzPath);
const Pathfinder = await importDataFromPath(pathfinderPath);
const Pyre = await importDataFromPath(pyrePath);

// Blue Group
const brassPath = "./data/raw/norse/blue/Brass";
const copperBorrePath = "./data/raw/norse/blue/CopperBorre";
const emeraldQuartzPath = "./data/raw/norse/blue/EmeraldQuartz";
const frostBorrePath = "./data/raw/norse/blue/FrostBorre";

const Brass = await importDataFromPath(brassPath);
const CopperBorre = await importDataFromPath(copperBorrePath);
const EmeraldQuartz = await importDataFromPath(emeraldQuartzPath);
const FrostBorre = await importDataFromPath(frostBorrePath);

// Purple Group
const astralJormungandrPath = "./data/raw/norse/purple/AstralJormungandr";
const emeraldJormungandrPath = "./data/raw/norse/purple/EmeraldJormungandr";
const flameJormungandrPath = "./data/raw/norse/purple/FlameJormungandr";

const AstralJormungandr = await importDataFromPath(astralJormungandrPath);
const EmeraldJormungandr = await importDataFromPath(emeraldJormungandrPath);
const FlameJormungandr = await importDataFromPath(flameJormungandrPath);



const allSkins = arrayJoin(
  // stmarc
  // gray
  BambooGarden, Jungle, JungleThicket, Seabird, Surfwood,
  // lightblue
  BananaLeaf, DarkBlossom, RustLeaf, SunsetLily,
  // blue
  CrimsonBlossom, DayLily, Sundown, TealBlossom,
  // purple
  MidnightLily, SeaCalico, SynthLeaf,

  // canals
  // gray
  BoroqueSand, CanalSpray, Indigo, NavyMurano, StoneMosaico,
  // lightblue
  BaroquePurple, CandyApple, DarkFiligree, OrangeMurano,
  // blue
  BaroqueRed, Emerald, OrangeFiligree, VioletMurano,
  // purple
  BaroqueOrange, RedFiligree, StainedGlass,

  // norse
  // gray
  Barricade, NightBorre, RedStone, Scorched, Tornado,
  // lightblue
  Chainmail, MossQuartz, Pathfinder, Pyre,
  // blue
  Brass, CopperBorre, EmeraldQuartz, FrostBorre,
  // purple
  AstralJormungandr, EmeraldJormungandr, FlameJormungandr
);



// extrair dados especificos de todas as skins
const allSkinsPrices = allSkins.map(skin => skin.price);
const allSkinsAmount = allSkins.map(skin => skin.amount);


// ordernar as listas acima de menor para maior
sortArray(allSkinsPrices)
sortArray(allSkinsAmount)



// -------------------------------
// [{date:, prices[], amounts[]}]
// -------------------------------

interface OriginalSkinData {
  date: string;
  price: number;
  amount: string;
}

interface GroupedSkinData {
  date: string;
  prices: number[];
  amounts: string[];
}

function aggregateSkins(skins: OriginalSkinData[]): GroupedSkinData[] {
  const grouped: { [key: string]: GroupedSkinData } = {};

  skins.forEach(({ date, price, amount }) => {
    if (!grouped[date]) {
      grouped[date] = { date, prices: [], amounts: [] };
    }
    grouped[date].prices.push(price);
    grouped[date].amounts.push(amount);
  });

  return Object.values(grouped);
}


// ------------- //
// CRIAR INDICES //
// ------------- //

// RAW
// all from collection
const StMarcIndexData: OriginalSkinData[] = arrayJoin(BambooGarden, Jungle, JungleThicket, Seabird, Surfwood, BananaLeaf, DarkBlossom, RustLeaf, SunsetLily, CrimsonBlossom, DayLily, Sundown, TealBlossom, MidnightLily, SeaCalico, SynthLeaf);
const CanalsIndexData: OriginalSkinData[] = arrayJoin(BoroqueSand, CanalSpray, Indigo, NavyMurano, StoneMosaico, BaroquePurple, CandyApple, DarkFiligree, OrangeMurano, BaroqueRed, Emerald, OrangeFiligree, VioletMurano, BaroqueOrange, RedFiligree, StainedGlass);
const NorseIndexData: OriginalSkinData[] = arrayJoin(Barricade, NightBorre, RedStone, Scorched, Tornado, Chainmail, MossQuartz, Pathfinder, Pyre, Brass, CopperBorre, EmeraldQuartz, FrostBorre, AstralJormungandr, EmeraldJormungandr, FlameJormungandr);

// all from color
const GrayIndexData: OriginalSkinData[] = arrayJoin(BambooGarden, Jungle, JungleThicket, Seabird, Surfwood, BoroqueSand, CanalSpray, Indigo, NavyMurano, StoneMosaico, Barricade, NightBorre, RedStone, Scorched, Tornado);
const LightblueIndexData: OriginalSkinData[] = arrayJoin(BananaLeaf, DarkBlossom, RustLeaf, SunsetLily, BaroquePurple, CandyApple, DarkFiligree, OrangeMurano, Chainmail, MossQuartz, Pathfinder, Pyre);
const BlueIndexData: OriginalSkinData[] = arrayJoin(CrimsonBlossom, DayLily, Sundown, TealBlossom, BaroqueRed, Emerald, OrangeFiligree, VioletMurano, Brass, CopperBorre, EmeraldQuartz, FrostBorre);
const PurpleIndexData: OriginalSkinData[] = arrayJoin(MidnightLily, SeaCalico, SynthLeaf, BaroqueOrange, RedFiligree, StainedGlass, AstralJormungandr, EmeraldJormungandr, FlameJormungandr);



// AGGREGATED
// all from collection
const StMarcIndex = aggregateSkins(StMarcIndexData)
const CanalsIndex = aggregateSkins(CanalsIndexData)
const NorseIndex = aggregateSkins(NorseIndexData)

// all from color
const GrayIndex = aggregateSkins(GrayIndexData)
const LightblueIndex = aggregateSkins(CanalsIndexData)
const BlueIndex = aggregateSkins(BlueIndexData)
const PurpleIndex = aggregateSkins(PurpleIndexData)



// pegar dia especifico de um indice
function getDataByDate(dataArray: any[], targetDate: any) {
  const result = dataArray.find(item => item.date === targetDate);
  return result || null; // Return the full object or null if not found
}

// -------------------------------------- //
// CALCULOS COM O PRECO DE TODAS AS SKINS //
// -------------------------------------- //

// media
const allSkinsPriceMean = mean(allSkinsPrices);


// mediana
const allSkinsPriceMedian = median(allSkinsPrices);

// moda
const allSkinsPriceMode = mode(allSkinsPrices);

// desvio padrao
const allSkinsPriceStdDev = stdDev(allSkinsPrices);

// variancia
const allSkinsPriceVariance = variance(allSkinsPrices);

// imprimir todos os dados

console.log('--------------------------------------');
console.log('CALCULOS COM O PRECO DE TODAS AS SKINS');
console.log('--------------------------------------');
console.log(`Media: ${allSkinsPriceMean}`)
console.log(`Mediana: ${allSkinsPriceMedian}`)
console.log(`Moda: ${allSkinsPriceMode}`)
console.log(`Desvio Padrao: ${allSkinsPriceStdDev}`)
console.log(`Variancia: ${allSkinsPriceVariance}`)


console.log('--------------------------------------');

// EXEMPLO: Media de preco de vendas de skins cinzas no dia 10 de outubro de 2024
const grayoct10 = getDataByDate(GrayIndex, "Oct 10 2024 01: +0");
const grayoct10Mean = mean(grayoct10.prices);
console.log(`Media precos skins cinzas dia 10/10/24: ${grayoct10Mean}`)