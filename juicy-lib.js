(function (window) {
  const config = {
    effects: {},
  };

  class SoundManager {
    constructor() {
      this.setVolume(0.1);
      this.currentHowl = null;
    }

    setVolume(volume) {
      if (volume >= 0 && volume <= 1) {
        Howler.volume(volume);
      } else {
        console.error("Volume should be defined betweem 0 and 1");
      }
    }

    async playSound(howlInstance) {
      if (this.currentHowl && this.currentHowl.playing()) {
        this.currentHowl.stop();
      }

      // Met à jour la référence
      this.currentHowl = howlInstance;

      //gestion du chargement
      const state = howlInstance.state();
      if (state === "loaded") {
        howlInstance.play();
      } else if (state === "loading") {
        await new Promise((resolve) => {
          howlInstance.once("load", resolve);
        });
        howlInstance.play();
      } else {
        howlInstance.load();
        await new Promise((resolve) => {
          howlInstance.once("load", resolve);
        });
        howlInstance.play();
      }
    }
  }

  const preloadSounds = function () {
    Object.keys(config.effects).forEach((effectName) => {
      const effect = config.effects[effectName];
      if (effect.sound) {
        effect.howl = new Howl({
          src: [effect.sound],
          preload: true,
        });
      }
    });
  };

  const attachEvents = function () {
    Object.keys(config.effects).forEach((effectName) => {
      const effect = config.effects[effectName];
      const elements = document.querySelectorAll(effect.target);

      switch(effect.trigger){
        case 'click':
          elements.forEach((elem) => {
            elem.addEventListener("click", ()=>{
              JuicyLib.trigger(elem, effectName);
            });
          });
          break;
        case "hover":
          elements.forEach((elem) => {
            // On utilise mouseenter pour le "hover"
            elem.addEventListener("mouseenter", () => {
              JuicyLib.trigger(elem, effectName);
            });
          });
          break;
          case "load":
          // Pour "load", on peut déclencher directement à la fin du chargement
          window.addEventListener("load", () => {
            // Si on veut affecter chaque élément, on boucle
            elements.forEach((elem) => {
              JuicyLib.trigger(elem, effectName);
            });
          });
          break; 
      }
    })
  }

  const JuicyLib = {
    soundManager: new SoundManager(),
    /**
     * @param {HTMLElement} element -L'élément sur lequel appliquer l'animation.
     * @param {string} effectName - Le nom de l'effet à déclencher.
     */
    trigger: function (element, effectName) {
      const effect = config.effects[effectName];
      if (!effect) {
        console.warn("JuicyLib: effet non trouvé :", effectName);
        return;
      }

      if (effect.type === "sound" || effect.type === "both") {
        if (effect.howl) {
          JuicyLib.soundManager.playSound(effect.howl);
        }
      }

      if ((effect.type === "animation" || effect.type === "both") && effect.animation) {
        // Vérification de l'élément
        if (!element || !element.classList) {
          console.error("L'élément fourni n'est pas valide :", element);
          return;
        }
        // Retire la classe si elle existe déjà
        element.classList.remove("animate__animated", effect.animation);
        // Force un reflow
        void element.offsetWidth;
        // Ajoute la classe
        element.classList.add("animate__animated", effect.animation);
        // Retire la classe à la fin de l'animation
        const handleAnimationEnd = () => {
          element.classList.remove("animate__animated", effect.animation);
          element.removeEventListener("animationend", handleAnimationEnd);
        };
        element.addEventListener("animationend", handleAnimationEnd);
      }

      if (effect.element){

      }
    },

    addEffect: function (name, effect) {
      config.effects[name] = effect;
      if (effect.sound) {
        effect.howl = new Howl({
          src: [effect.sound],
          preload: true,
        });
      }
    },

    removeEffect: function (name) {
      delete config.effects[name];
    },

    updateEffect: function (name, newEffect) {
      if (config.effects[name]) {
        config.effects[name] = { ...congif.effects[name], ...newEffect };
      }
    },

    getEffects: function () {
      return config.effects;
    },

    init: function () {
      // Précharge les sons
      preloadSounds();
      // Attache les events sur tous les targets
      attachEvents();
    },
  };

  document.addEventListener("DOMContentLoaded", JuicyLib.init);

  window.JuicyLib = JuicyLib;
})(window);
