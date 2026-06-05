import { ComponenteCuerpo } from "./ComponenteCuerpo.js";

export class ComponenteNeurodigital extends ComponenteCuerpo {
  #procesamiento;
  #slotsVirtuales;

  constructor(datos) {
    super(datos);
    this.setProcesamiento(datos.procesamiento);
    this.setSlotsVirtuales(datos.slotsVirtuales);
  }

  get procesamiento() {
    return this.#procesamiento;
  }

  get slotsVirtuales() {
    return this.#slotsVirtuales;
  }

  setProcesamiento(procesamiento) {
    const valor = Number(procesamiento);

    if (!Number.isFinite(valor) || valor < 1 || valor > 100) {
      throw new Error("El procesamiento neurodigital debe estar entre 1 y 100.");
    }

    this.#procesamiento = valor;
  }

  setSlotsVirtuales(slotsVirtuales) {
    const valor = Number(slotsVirtuales);

    if (!Number.isInteger(valor) || valor < 1 || valor > 8) {
      throw new Error("Los slots virtuales deben ser un numero entero entre 1 y 8.");
    }

    this.#slotsVirtuales = valor;
  }

  activarMecanismo() {
    return `Sinapsis digital sincronizada: ${this.#procesamiento} THz / ${this.#slotsVirtuales} slots virtuales.`;
  }

  obtenerResumen() {
    return {
      ...super.obtenerResumen(),
      procesamiento: this.#procesamiento,
      slotsVirtuales: this.#slotsVirtuales,
    };
  }
}
