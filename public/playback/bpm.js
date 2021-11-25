export default document.querySelector("#BPM").addEventListener("input", () => {
  let BPM = document.querySelector("#BPM").value;
  Tone.Transport.bpm.value = parseInt(BPM);
  document.querySelector("#BPM-label").innerHTML = `BPM: ${BPM}`;
});
