const slotLabels = {
  head: "HEAD",
  torso: "TORSO",
  "left-arm": "LEFT ARM",
  "right-arm": "RIGHT ARM",
  legs: "LEGS",
};

const slotLetters = {
  head: "A",
  torso: "B",
  "left-arm": "C",
  "right-arm": "D",
  legs: "E",
};

export class EnsamblajeUI {
  #slots;
  #installedList;
  #humanityValue;
  #humanityBar;
  #consoleOutput;
  #figure;

  constructor() {
    this.#slots = document.querySelectorAll("[data-slot-card]");
    this.#installedList = document.querySelector("#installedList");
    this.#humanityValue = document.querySelector("#humanityValue");
    this.#humanityBar = document.querySelector("#humanityBar");
    this.#consoleOutput = document.querySelector("#consoleOutput");
    this.#figure = document.querySelector("#humanFigure");
  }

  actualizarVista(componentes, componenteActivado = null) {
    const humanidad = this.#calcularHumanidad(componentes);

    this.#actualizarSlots(componentes);
    this.#actualizarLista(componentes);
    this.#actualizarHumanidad(humanidad);
    this.#actualizarMarcadoresVisuales(componentes, componenteActivado);

    if (componenteActivado) {
      this.escribirConsola(componenteActivado.activarMecanismo(), "success");
    }
  }

  mostrarError(mensaje) {
    this.escribirConsola(mensaje, "danger");
  }

  escribirConsola(mensaje, tipo = "info") {
    const item = document.createElement("li");
    item.className = `console-line console-line--${tipo}`;
    item.textContent = `> ${mensaje}`;
    this.#consoleOutput.prepend(item);
  }

  #actualizarSlots(componentes) {
    this.#slots.forEach((slotCard) => {
      const slot = slotCard.dataset.slotCard;
      const componente = componentes.get(slot);
      const estado = slotCard.querySelector("[data-slot-state]");
      const nombre = slotCard.querySelector("[data-slot-name]");
      const detalle = slotCard.querySelector("[data-slot-detail]");

      slotCard.classList.toggle("slot-card--equipped", Boolean(componente));

      if (!componente) {
        estado.textContent = "[OPEN]";
        nombre.textContent = "Ranura disponible";
        detalle.textContent = `Slot ${slotLetters[slot]} listo para instalacion.`;
        return;
      }

      const resumen = componente.obtenerResumen();
      estado.textContent = "[EQUIPPED]";
      nombre.textContent = resumen.nombre;
      detalle.textContent = `${resumen.tipo} | ${resumen.rareza} | Poder ${resumen.poder}`;
    });
  }

  #actualizarLista(componentes) {
    this.#installedList.innerHTML = "";

    if (componentes.size === 0) {
      const empty = document.createElement("li");
      empty.textContent = "Sin implantes instalados";
      this.#installedList.append(empty);
      return;
    }

    componentes.forEach((componente) => {
      const resumen = componente.obtenerResumen();
      const item = document.createElement("li");
      item.textContent = `${slotLabels[resumen.slot]}: ${resumen.nombre}`;
      this.#installedList.append(item);
    });
  }

  #actualizarHumanidad(valor) {
    this.#humanityValue.textContent = `${valor}/100`;
    this.#humanityBar.style.width = `${valor}%`;
    this.#humanityBar.setAttribute("aria-valuenow", String(valor));
  }

  #actualizarMarcadoresVisuales(componentes, componenteActivado) {
    this.#figure.querySelectorAll("[data-figure-slot]").forEach((marker) => {
      const slot = marker.dataset.figureSlot;
      const componente = componentes.get(slot);
      marker.classList.toggle("is-equipped", Boolean(componente));
      marker.title = componente ? "Clic para quitar pieza" : "Ranura disponible";
      marker.setAttribute("aria-label", componente ? `Quitar pieza de Slot ${slotLetters[slot]}` : `Slot ${slotLetters[slot]} abierto`);

      if (componente) {
        const resumen = componente.obtenerResumen();
        marker.innerHTML = `
          <strong>Slot ${slotLetters[slot]}</strong>
          <span>[EQUIPPED]</span>
          <small>${resumen.nombre}</small>
        `;
        return;
      }

      marker.innerHTML = `
        <strong>Slot ${slotLetters[slot]}</strong>
        <span>[OPEN]</span>
      `;
    });

    if (!componenteActivado) {
      return;
    }

    const activeMarker = this.#figure.querySelector(
      `[data-figure-slot="${componenteActivado.slot}"]`,
    );

    activeMarker?.classList.add("pulse");
    window.setTimeout(() => activeMarker?.classList.remove("pulse"), 700);
  }

  #calcularHumanidad(componentes) {
    const costoTotal = [...componentes.values()].reduce(
      (total, componente) => total + componente.costoHumanidad,
      0,
    );

    return Math.max(0, 100 - costoTotal);
  }
}

export { slotLabels };
