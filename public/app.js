import keys from "./object-literals/keys.js";
import romanNums from "./object-literals/romanNums.js";
import chordQuality from "./object-literals/chordQuality.js";
import myChordProgressions from "./object-literals/myChordProgressions.js";
import wait from "./utils/wait.js";
import "./playback/volume.js";
import "./playback/bpm.js";

let chordClip, kickClip, snareClip, hihatClip;
let key = 0;
let firstChord, secondChord, thirdChord, fourthChord, previousRandomNumber;
let userSampleChoice = samples.piano;

let rhythmPattern = "x_x_";
let subdivPattern = "4n";
let kickRhythmPattern = "-";
let kickSubdivPattern = "4n";
let snareRhythmPattern = "-";
let snareSubdivPattern = "4n";
let hihatRhythmPattern = "-";
let hihatSubdivPattern = "8n";

Tone.Master.volume.value = -10;

function getRandomChords() {
  let oldChords = [firstChord, secondChord, thirdChord, fourthChord];
  //first chord generator
  let rand = Math.random() * 100;

  if (rand < 40) firstChord = 1;
  else if (rand < 60) firstChord = 6;
  else if (rand < 80) firstChord = 2;
  else firstChord = 4;

  //second chord generator
  rand = Math.random() * 100;

  if (rand < 40) secondChord = 6;
  else if (rand < 60) secondChord = 2;
  else if (rand < 80) secondChord = 3;
  else secondChord = 4;

  //third chord generator
  rand = Math.random() * 100;

  if (rand < 10) thirdChord = 2;
  else if (rand < 20) thirdChord = 3;
  else if (rand < 50) thirdChord = 1;
  else if (rand < 70) thirdChord = 6;
  else if (rand < 80) thirdChord = 7;
  else thirdChord = 4;

  //fourth chord generator
  rand = Math.random() * 100;

  if (rand < 10) fourthChord = 2;
  else if (rand < 50) fourthChord = 5;
  else if (rand < 70) fourthChord = 6;
  else if (rand < 80) fourthChord = 7;
  else fourthChord = 4;

  let rerolledChords = [firstChord, secondChord, thirdChord, fourthChord];

  const valuesWhichRepeat = (arr, count) =>
    [...new Set(arr)].filter((x) => arr.filter((a) => a === x).length >= count);

  /*
  logic below generates a new chord progression if the 
  currently generated chord progression includes one chord three times 
  or if the current chord progression is the same as the previous one
  */
  if (
    valuesWhichRepeat(rerolledChords, 3).length ||
    JSON.stringify(rerolledChords) == JSON.stringify(oldChords)
  ) {
    getRandomChords();
  }
}

function getPredeterminedChords() {
  let rand = Math.floor(Math.random() * myChordProgressions.length);

  firstChord = myChordProgressions[rand][0];
  secondChord = myChordProgressions[rand][1];
  thirdChord = myChordProgressions[rand][2];
  fourthChord = myChordProgressions[rand][3];

  if (rand === previousRandomNumber) {
    getPredeterminedChords();
  }
  previousRandomNumber = rand;
}

getPredeterminedChords();

function makeChord(num) {
  if (num === 1)
    return [
      keys[key][1] + "3",
      keys[key][5] + "3",
      keys[key][1] + "4",
      keys[key][3] + "4",
    ];
  else if (num === 2)
    return [
      keys[key][2] + "3",
      keys[key][6] + "3",
      keys[key][2] + "4",
      keys[key][4] + "4",
    ];
  else if (num === 3)
    return [
      keys[key][3] + "3",
      keys[key][7] + "3",
      keys[key][3] + "4",
      keys[key][5] + "4",
    ];
  else if (num === 4)
    return [
      keys[key][4] + "3",
      keys[key][1] + "4",
      keys[key][4] + "4",
      keys[key][6] + "4",
    ];
  else if (num === 5)
    return [
      keys[key][5] + "3",
      keys[key][2] + "4",
      keys[key][5] + "4",
      keys[key][7] + "4",
    ];
  else if (num === 6)
    return [
      keys[key][6] + "3",
      keys[key][3] + "4",
      keys[key][6] + "4",
      keys[key][1] + "4",
    ];
  else if (num === 7)
    return [
      keys[key][7] + "3",
      keys[key][4] + "4",
      keys[key][6] + "4",
      keys[key][2] + "4",
    ];
}

let makeProgression = [
  makeChord(firstChord),
  makeChord(secondChord),
  makeChord(thirdChord),
  makeChord(fourthChord),
];

let notesPattern = [
  makeChord(firstChord),
  makeChord(firstChord),
  makeChord(secondChord),
  makeChord(secondChord),
  makeChord(thirdChord),
  makeChord(thirdChord),
  makeChord(fourthChord),
  makeChord(fourthChord),
];

function stopPlayback() {
  chordClip.stop();
  kickClip.stop();
  snareClip.stop();
  hihatClip.stop();
  Tone.Transport.stop();

  createClips();

  document.querySelector("#new").disabled = true;
  document.querySelector("#play-button").disabled = true;
}

document
  .querySelector("#instrument")
  .addEventListener("change", changeInstrument);

async function changeInstrument() {
  let choice = document.querySelector("#instrument").value;

  if (choice === "piano") userSampleChoice = samples.piano;
  else if (choice === "ciriusRez") userSampleChoice = samples.ciriusRez;
  else if (choice === "jarblePerator")
    userSampleChoice = samples.jarblePerator;

  stopPlayback();
  
  await wait();
}

document.querySelector("#pattern").addEventListener("change", changePattern);

async function changePattern() {
  let pattern = document.querySelector("#pattern").value;

  if (pattern === "latin") {
    notesPattern = [
      makeChord(firstChord),
      makeChord(firstChord),
      makeChord(firstChord),
      makeChord(secondChord),
      makeChord(secondChord),
      makeChord(secondChord),
      makeChord(thirdChord),
      makeChord(thirdChord),
      makeChord(thirdChord),
      makeChord(fourthChord),
      makeChord(fourthChord),
      makeChord(fourthChord),
    ];
    rhythmPattern = "x__x__x_";
    subdivPattern = "8n";
  } else if (pattern === "whole") {
    notesPattern = [
      makeChord(firstChord),
      makeChord(secondChord),
      makeChord(thirdChord),
      makeChord(fourthChord),
    ];
    rhythmPattern = "x___";
    subdivPattern = "4n";
  } else if (pattern === "half") {
    notesPattern = [
      makeChord(firstChord),
      makeChord(firstChord),
      makeChord(secondChord),
      makeChord(secondChord),
      makeChord(thirdChord),
      makeChord(thirdChord),
      makeChord(fourthChord),
      makeChord(fourthChord),
    ];
    rhythmPattern = "x_x_";
    subdivPattern = "4n";
  } else if (pattern === "quarter") {
    notesPattern = [
      makeChord(firstChord),
      makeChord(firstChord),
      makeChord(firstChord),
      makeChord(firstChord),
      makeChord(secondChord),
      makeChord(secondChord),
      makeChord(secondChord),
      makeChord(secondChord),
      makeChord(thirdChord),
      makeChord(thirdChord),
      makeChord(thirdChord),
      makeChord(thirdChord),
      makeChord(fourthChord),
      makeChord(fourthChord),
      makeChord(fourthChord),
      makeChord(fourthChord),
    ];
    rhythmPattern = "xxxx";
    subdivPattern = "4n";
  } else if (pattern === "pop") {
    notesPattern = [];

    for (let i = 0; i <= 5; i++) {
      notesPattern.push(makeChord(firstChord));
    }

    for (let i = 0; i <= 5; i++) {
      notesPattern.push(makeChord(secondChord));
    }

    for (let i = 0; i <= 5; i++) {
      notesPattern.push(makeChord(thirdChord));
    }

    for (let i = 0; i <= 5; i++) {
      notesPattern.push(makeChord(fourthChord));
    }

    rhythmPattern = "x__x__x__x__x_x_";
    subdivPattern = "16n";
  } else if (pattern === "surf") {
    notesPattern = [];

    for (let i = 0; i <= 2; i++) {
      notesPattern.push(makeChord(firstChord));
    }

    for (let i = 0; i <= 2; i++) {
      notesPattern.push(makeChord(secondChord));
    }

    for (let i = 0; i <= 2; i++) {
      notesPattern.push(makeChord(thirdChord));
    }

    for (let i = 0; i <= 2; i++) {
      notesPattern.push(makeChord(fourthChord));
    }

    rhythmPattern = "--xx--x-";
    subdivPattern = "8n";
  }
  makeProgression = [
    makeChord(firstChord),
    makeChord(secondChord),
    makeChord(thirdChord),
    makeChord(fourthChord),
  ];
  
  stopPlayback();

  await wait();
}

document.querySelector("#drums").addEventListener("change", changeDrumPattern);

async function changeDrumPattern() {
  let drumPattern = document.querySelector("#drums").value;

  if (drumPattern === "rock") {
    kickRhythmPattern = "x-";
    kickSubdivPattern = "4n";

    snareRhythmPattern = "-x";
    snareSubdivPattern = "4n";

    hihatRhythmPattern = "x";
    hihatSubdivPattern = "8n";
  } else if (drumPattern === "four") {
    kickRhythmPattern = "x";
    kickSubdivPattern = "4n";

    snareRhythmPattern = "-";
    snareSubdivPattern = "4n";

    hihatRhythmPattern = "-";
    hihatSubdivPattern = "8n";
  } else if (drumPattern === "minimal") {
    kickRhythmPattern = "x-";
    kickSubdivPattern = "4n";

    snareRhythmPattern = "-x";
    snareSubdivPattern = "4n";

    hihatRhythmPattern = "-";
    hihatSubdivPattern = "8n";
  } else if (drumPattern === "pop") {
    kickRhythmPattern = "x[-x][-x]-";
    kickSubdivPattern = "4n";

    snareRhythmPattern = "-x";
    snareSubdivPattern = "4n";

    hihatRhythmPattern = "-";
    hihatSubdivPattern = "8n";
  } else if (drumPattern === "none") {
    kickRhythmPattern = "-";
    kickSubdivPattern = "4n";

    snareRhythmPattern = "-";
    snareSubdivPattern = "4n";

    hihatRhythmPattern = "-";
    hihatSubdivPattern = "8n";
  } else if (drumPattern === "break") {
    kickRhythmPattern = "xx-[x-][x-]x--";
    kickSubdivPattern = "8n";

    snareRhythmPattern = "--x[-x][-x]-x-";
    snareSubdivPattern = "8n";

    hihatRhythmPattern = "x";
    hihatSubdivPattern = "8n";
  }

  stopPlayback();

  await wait();
}

document.querySelector("#key").addEventListener("change", changeKeySignature);

async function changeKeySignature() {
  key = document.querySelector("#key").value;
  key = parseInt(key) - 1;

  changePattern();

  displayChordNames();

  document.querySelector("#new").disabled = true;
  document.querySelector("#play-button").disabled = true;

  await wait();
}

document.querySelector("#new").addEventListener("click", makeNewProgression);

async function makeNewProgression() {
  let rnd = Math.random() * 100;

  if (rnd < 60) getRandomChords();
  else if (rnd < 100) getPredeterminedChords();

  changePattern();

  displayChordNames();

  document.querySelector("#new").disabled = true;
  document.querySelector("#play-button").disabled = true;

  await wait();
}

createClips();

function createClips() {
  const sampler = new Tone.Sampler({
    urls: userSampleChoice,
    baseUrl: "http://localhost:3000/samples/",
  });

  chordClip = scribble
    .clip({
      instrument: sampler,
      notes: notesPattern,
      pattern: rhythmPattern,
      subdiv: subdivPattern,
    })
    .start();

  setTimeout(() => {
    kickClip = scribble
      .clip({
        sample: "http://localhost:3000/samples/drum/Kick-Drum-15.wav", // new property: sample
        pattern: kickRhythmPattern,
        subdiv: kickSubdivPattern,
        volume: 5,
      })
      .start();
  }, 100);

  setTimeout(() => {
    snareClip = scribble
      .clip({
        sample: "http://localhost:3000/samples/drum/snare.wav", // new property: sample
        pattern: snareRhythmPattern,
        subdiv: snareSubdivPattern,
        volume: -2,
      })
      .start();
  }, 200);

  setTimeout(() => {
    hihatClip = scribble
      .clip({
        sample: "http://localhost:3000/samples/drum/Hi-Hat-5.wav", // new property: sample
        pattern: hihatRhythmPattern,
        subdiv: hihatSubdivPattern,
        volume: -10,
      })
      .start();
  }, 300);
}

document.querySelector("#play-button").addEventListener("click", play);

function play() {
  if (Tone.Transport.state !== "started") {
    Tone.context.resume().then(() => Tone.Transport.start());
    Tone.Transport.start();
  } else {
    changeDrumPattern();
  }
}

displayChordNames();

function displayChordNames() {
  if (makeProgression[0][0].slice(1, 2) === "b")
    document.querySelector("#rowOne-first").innerHTML =
      makeProgression[0][0].slice(0, 2) + chordQuality[firstChord];
  else
    document.querySelector("#rowOne-first").innerHTML =
      makeProgression[0][0].slice(0, 1) + chordQuality[firstChord];

  if (makeProgression[1][0].slice(1, 2) === "b")
    document.querySelector("#rowOne-second").innerHTML =
      makeProgression[1][0].slice(0, 2) + chordQuality[secondChord];
  else
    document.querySelector("#rowOne-second").innerHTML =
      makeProgression[1][0].slice(0, 1) + chordQuality[secondChord];

  if (makeProgression[2][0].slice(1, 2) === "b")
    document.querySelector("#rowOne-third").innerHTML =
      makeProgression[2][0].slice(0, 2) + chordQuality[thirdChord];
  else
    document.querySelector("#rowOne-third").innerHTML =
      makeProgression[2][0].slice(0, 1) + chordQuality[thirdChord];

  if (makeProgression[3][0].slice(1, 2) === "b")
    document.querySelector("#rowOne-fourth").innerHTML =
      makeProgression[3][0].slice(0, 2) + chordQuality[fourthChord];
  else
    document.querySelector("#rowOne-fourth").innerHTML =
      makeProgression[3][0].slice(0, 1) + chordQuality[fourthChord];

  displayRomanNumerals();
}

function displayRomanNumerals() {
  document.querySelector("#rowTwo-first").innerHTML = romanNums[firstChord];
  document.querySelector("#rowTwo-second").innerHTML = romanNums[secondChord];
  document.querySelector("#rowTwo-third").innerHTML = romanNums[thirdChord];
  document.querySelector("#rowTwo-fourth").innerHTML = romanNums[fourthChord];
}
