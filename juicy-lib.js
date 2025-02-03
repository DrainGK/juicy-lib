(function(window) {
    const config = {
      effects: {

        bounce: {
          animation: "animate__bounce",
          sound: "assets/correct-answer.mp3"
        },
        shake: {
          animation: "animate__shakeX",
          sound: "assets/wrong-answer.mp3"
        },
        dragonBall:{
            gif: "assets/kid-goku.gif",
            sound:"assets/jazz-loop.mp3"
        }
      }
    };
  
    const JuicyLib = {
      /**
       * @param {HTMLElement} element -L'élément sur lequel appliquer l'animation.
       * @param {string} effectName - Le nom de l'effet à déclencher.
       */
      trigger: function(element, effectName) {
        const effect = config.effects[effectName];
        if (!effect) {
          console.warn("JuicyLib: effet non trouvé :", effectName);
          return;
        }
  
        // Déclencher le son (si défini)
        if (effect.sound) {
          const audio = new Audio(effect.sound);
          audio.play().catch(e => console.error("Erreur lors de la lecture du son :", e));
        }

        if (effect.gif) {
          }
  
        // Déclencher l'animation (si définie)
        if (effect.animation) {
          if (!element || !element.classList) {
            console.error("L'élément fourni n'est pas valide :", element);
            return;
          }
          
          // Retirer les classes si elles existent déjà
          element.classList.remove("animate__animated", effect.animation);
          
          // Forcer un reflow pour que l'ajout des classes déclenche l'animation
          void element.offsetWidth;
          
          // Ajouter les classes nécessaires à Animate.css
          element.classList.add("animate__animated", effect.animation);
          
          // Écouter la fin de l'animation pour retirer les classes et permettre une réactivation ultérieure
          const handleAnimationEnd = () => {
            element.classList.remove("animate__animated", effect.animation);
            element.removeEventListener("animationend", handleAnimationEnd);
          };
          element.addEventListener("animationend", handleAnimationEnd);
        }
      },

      addEffect: function(name, effect){
        config.effects[name] = effect;
      },

      removeEffect: function(name){
       delete config.effects[name];
      },

      updateEffect: function(name, newEffect){
        if(config.effects[name]){
            config.effects[name] = {...congif.effects[name], ...newEffect};
        }
      },

      getEffects: function(){
        return config.effects;
      },
  
      init: function() {
        // Parcourt tous les éléments ayant l'attribut data-juicy-effect
        document.querySelectorAll("[data-juicy-effect]").forEach(function(elem) {
          elem.addEventListener("click", function() {
            const effectName = elem.getAttribute("data-juicy-effect");
            JuicyLib.trigger(elem, effectName);
          });
        });
      }
    };
  
    document.addEventListener("DOMContentLoaded", JuicyLib.init);
  
    window.JuicyLib = JuicyLib;
  })(window);
  