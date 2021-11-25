export default document.querySelector("#vol").addEventListener("input", () => {
  let vol = document.querySelector("#vol").value;
  Tone.Master.volume.value = parseInt(vol);
  if (parseInt(vol) === -60) {
    Tone.Master.mute = true;
  }
});
