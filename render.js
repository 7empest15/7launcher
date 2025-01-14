function launchGame(command) {
    window.electronAPI.launchGame(command);
  }

  function quitApp() {
    window.electronAPI.quitApp();
  }

  // Gamepad navigation logic
  const tiles = document.querySelectorAll('.tile');
  const carousel = document.querySelector('.carousel');
  const infoTitle = document.getElementById('info-title');
  const infoDescription = document.getElementById('info-description');
  let selectedIndex = 0;

  function updateSelection() {
    tiles.forEach((tile, index) => {
      if (index === selectedIndex) {
        tile.style.border = '2px solid blue';
        carousel.scrollLeft = tile.offsetLeft - carousel.offsetLeft - (carousel.clientWidth / 2) + (tile.clientWidth / 2);
        infoTitle.textContent = tile.querySelector('h3').textContent;
        infoDescription.textContent = `Description du jeu ${index + 1}`;
      } else {
        tile.style.border = 'none';
      }
    });
  }

  function handleGamepadInput() {
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
      const gp = gamepads[0];
      if (gp.buttons[14].pressed || gp.axes[0] < -0.5) { // Left
        selectedIndex = (selectedIndex - 1 + tiles.length) % tiles.length;
        updateSelection();
      } else if (gp.buttons[15].pressed || gp.axes[0] > 0.5) { // Right
        selectedIndex = (selectedIndex + 1) % tiles.length;
        updateSelection();
      } else if (gp.buttons[0].pressed) { // A button
        tiles[selectedIndex].click();
      }
    }
  }

  window.addEventListener('gamepadconnected', () => {
    console.log('Gamepad connected');
    updateSelection();
    setInterval(handleGamepadInput, 100);
  });

  window.addEventListener('gamepaddisconnected', () => {
    console.log('Gamepad disconnected');
  });