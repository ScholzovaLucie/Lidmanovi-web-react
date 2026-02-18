const useClickSound = () => {
  const playClickSound = () => {
    try {
      const audio = new Audio("./sounds/click.wav");

      // Debug informace
      console.log("Pokus o přehrání zvuku:", "/sounds/click.wav");

      // Přehrát zvuk
      const playPromise = audio.play();

      // Moderní prohlížeče vrací Promise
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Zvuk se přehrál úspěšně");
          })
          .catch((error) => {
            console.error("Chyba při přehrávání zvuku:", error);
            // Často kvůli autoplay policy
            // Tip: Ujisti se, že uživatel už někde klikl na stránce
          });
      }
    } catch (error) {
      console.error("Nepodařilo se vytvořit audio objekt:", error);
      console.log("Zkontroluj, zda existuje soubor ./sounds/click.wav");
    }
  };

  return playClickSound;
};

export default useClickSound;
