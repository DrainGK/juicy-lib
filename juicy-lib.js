(function(window) {
    const config = {
      effects: {
      }
    };

    class SoundManager {
        constructor(){
            this.setVolume(0.1);
            this.currentHowl = null;
        }

        setVolume(volume){
            if(volume >= 0 && volume <= 1){
                Howler.volume(volume);
            } else {
                console.error("Volume should be defined betweem 0 and 1")
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
              await new Promise(resolve => {
                howlInstance.once("load", resolve);
              });
              howlInstance.play();
            } else {
              howlInstance.load();
              await new Promise(resolve => {
                howlInstance.once("load", resolve);
              });
              howlInstance.play();
            }
          }
    }

    const preloadSounds = function(){
        Object.keys(config.effects).forEach(effectName => {
            const effect = config.effects[effectName];
            if(effect.sound){
                effect.howl = new Howl({
                    src: [effect.sound],
                    preload: true
                })
            }
        })
    }
  
    const JuicyLib = {
        soundManager: new SoundManager(),
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
        if (effect.howl) {
            JuicyLib.soundManager.playSound(effect.howl);
          }

        if (effect.pic) {
          }
  
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
        if(effect.sound){
            effect.howl = new Howl({
                src: [effect.sound],
                preload: true
            })
        }
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
        preloadSounds();
        // Parcourt tous les éléments ayant l'attribut data-juicy-effect
        document.querySelectorAll("[data-juicy-click]").forEach(function(elem) {
          elem.addEventListener("click", function() {
            const effectName = elem.getAttribute("data-juicy-click");
            JuicyLib.trigger(elem, effectName);
          });
        });
      }
    };
  
    document.addEventListener("DOMContentLoaded", JuicyLib.init);
  
    window.JuicyLib = JuicyLib;
  })(window);
  