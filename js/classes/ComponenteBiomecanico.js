import { ComponenteCuerpo } from "./ComponenteCuerpo.js";

export class ComponenteBiomecanico extends ComponenteCuerpo {
  #resistencia;
  #energia;

  constructor(datos) {
    super(datos);
    this.setResistencia(datos.resistencia);
    this.setEnergia(datos.energia);
  }

  get resistencia() {
    return this.#resistencia;
  }

  get energia() {
    return this.#energia;
  }

  setResistencia(resistencia) {
    const valor = Number(resistencia);

    if (!Number.isFinite(valor) || valor < 1 || valor > 100) {
      throw new Error("La resistencia biomecanica debe estar entre 1 y 100.");
    }

    this.#resistencia = valor;
  }

  setEnergia(energia) {
    const valor = Number(energia);

    if (!Number.isFinite(valor) || valor < 1 || valor > 100) {
      throw new Error("La energia biomecanica debe estar entre 1 y 100.");
    }

    this.#energia = valor;
  }

  activarMecanismo() {
    return `Servomotores activos: +${this.#resistencia} resistencia / ${this.#energia}% energia.`;
  }

  obtenerResumen() {
    return {
      ...super.obtenerResumen(),
      resistencia: this.#resistencia,
      energia: this.#energia,
    };
  }
}
