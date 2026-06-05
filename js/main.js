import { ComponenteBiomecanico } from "./classes/ComponenteBiomecanico.js";
import { ComponenteNeurodigital } from "./classes/ComponenteNeurodigital.js";
import { EnsamblajeUI, slotLabels } from "./ui/ensamblajeUI.js";

const form = document.querySelector("#componentForm");
const typeSelect = document.querySelector("#componentType");
const biomechanicFields = document.querySelector("#biomechanicFields");
const neuroFields = document.querySelector("#neuroFields");
const clearButton = document.querySelector("#clearButton");
const forceErrorButton = document.querySelector("#forceErrorButton");

const componentesEquipados = new Map();
const ui = new EnsamblajeUI();

function obtenerDatosFormulario() {
  const formData = new FormData(form);

  return {
    tipo: formData.get("tipo"),
    slot: formData.get("slot"),
    nombre: formData.get("nombre"),
    rareza: formData.get("rareza"),
    costoHumanidad: formData.get("costoHumanidad"),
    poder: formData.get("poder"),
    resistencia: formData.get("resistencia"),
    energia: formData.get("energia"),
    procesamiento: formData.get("procesamiento"),
    slotsVirtuales: Number(formData.get("slotsVirtuales")),
  };
}

function crearComponente(datos) {
  if (datos.tipo === "biomecanico") {
    return new ComponenteBiomecanico(datos);
  }

  if (datos.tipo === "neurodigital") {
    return new ComponenteNeurodigital(datos);
  }

  throw new Error("Selecciona un tipo de componente valido.");
}

function alternarCamposPorTipo() {
  const esBiomecanico = typeSelect.value === "biomecanico";

  biomechanicFields.hidden = !esBiomecanico;
  neuroFields.hidden = esBiomecanico;

  biomechanicFields.querySelectorAll("input").forEach((input) => {
    input.disabled = !esBiomecanico;
  });

  neuroFields.querySelectorAll("input").forEach((input) => {
    input.disabled = esBiomecanico;
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const datos = obtenerDatosFormulario();
    const componente = crearComponente(datos);
    const anterior = componentesEquipados.get(componente.slot);

    componentesEquipados.set(componente.slot, componente);
    ui.actualizarVista(componentesEquipados, componente);

    if (anterior) {
      ui.escribirConsola(
        `${slotLabels[componente.slot]} reemplazo ${anterior.nombre} por ${componente.nombre}.`,
        "warning",
      );
    }

    form.nombre.value = "";
    form.nombre.focus();
  } catch (error) {
    ui.mostrarError(error.message);
    console.error(error);
  }
});

typeSelect.addEventListener("change", alternarCamposPorTipo);

document.addEventListener("click", (event) => {
  const slotElement = event.target.closest("[data-figure-slot], [data-slot-card]");

  if (!slotElement) {
    return;
  }

  const slot = slotElement.dataset.figureSlot ?? slotElement.dataset.slotCard;
  const componente = componentesEquipados.get(slot);

  if (!componente) {
    return;
  }

  componentesEquipados.delete(slot);
  ui.actualizarVista(componentesEquipados);
  ui.escribirConsola(`${componente.nombre} fue retirada de ${slotLabels[slot]}.`, "info");
});

clearButton.addEventListener("click", () => {
  componentesEquipados.clear();
  ui.actualizarVista(componentesEquipados);
  ui.escribirConsola("Sistema reiniciado. Todas las ranuras vuelven a estado OPEN.", "info");
});

forceErrorButton.addEventListener("click", () => {
  try {
    new ComponenteBiomecanico({
      tipo: "biomecanico",
      slot: "torso",
      nombre: "x",
      rareza: "Raro",
      costoHumanidad: 120,
      poder: 0,
      resistencia: 200,
      energia: -4,
    });
  } catch (error) {
    ui.mostrarError(`Error forzado por encapsulamiento: ${error.message}`);
    console.error("Prueba de encapsulamiento:", error);
  }
});

alternarCamposPorTipo();
ui.actualizarVista(componentesEquipados);
ui.escribirConsola("Nucleo de ensamblaje listo. Registra un componente para equiparlo.", "info");
