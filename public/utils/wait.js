function wait() {
  return new Promise(() => {
    setTimeout(() => {
      document.querySelector("#new").disabled = false;
      document.querySelector("#play-button").disabled = false;
    }, 500);
  });
}

export default wait;
