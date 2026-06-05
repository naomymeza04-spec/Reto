export class ComponenteCuerpo {
  static slotsValidos = ["head", "torso", "left-arm", "right-arm", "legs"];
  static rarezasValidas = ["Comun", "Raro", "Epico", "Legendario"];

  #id;
  #slot;
  #nombre;
  #rareza;
  #costoHumanidad;
  #poder;

  constructor({ slot, nombre, rareza, costoHumanidad, poder }) {
    this.#id = crypto.randomUUID();
    this.setSlot(slot);
    this.setNombre(nombre);
    this.setRareza(rareza);
    this.setCostoHumanidad(costoHumanidad);
    this.setPoder(poder);
  }

  get id() {
    return this.#id;
  }

  get slot() {
    return this.#slot;
  }

  get nombre() {
    return this.#nombre;
  }

  get rareza() {
    return this.#rareza;
  }

  get costoHumanidad() {
    return this.#costoHumanidad;
  }

  get poder() {
    return this.#poder;
  }

  setSlot(slot) {
    if (!ComponenteCuerpo.slotsValidos.includes(slot)) {
      throw new Error("Slot invalido. Selecciona una ranura del ensamblaje.");
    }

    this.#slot = slot;
  }

  setNombre(nombre) {
    const nombreLimpio = String(nombre).trim();

    if (nombreLimpio.length < 3) {
      throw new Error("El nombre del componente debe tener minimo 3 caracteres.");
    }

    this.#nombre = nombreLimpio.toUpperCase().replaceAll(" ", "_");
  }

  setRareza(rareza) {
    if (!ComponenteCuerpo.rarezasValidas.includes(rareza)) {
      throw new Error("Rareza invalida para el componente.");
    }

    this.#rareza = rareza;
  }

  setCostoHumanidad(costoHumanidad) {
    const costo = Number(costoHumanidad);

    if (!Number.isFinite(costo) || costo < 0 || costo > 100) {
      throw new Error("El costo de humanidad debe estar entre 0 y 100.");
    }

    this.#costoHumanidad = costo;
  }

  setPoder(poder) {
    const valorPoder = Number(poder);

    if (!Number.isFinite(valorPoder) || valorPoder < 1 || valorPoder > 100) {
      throw new Error("El poder debe estar entre 1 y 100.");
    }

    this.#poder = valorPoder;
  }

  activarMecanismo() {
    return "Sistema corporal enlazado con exito.";
  }

  obtenerResumen() {
    return {
      id: this.#id,
      slot: this.#slot,
      nombre: this.#nombre,
      rareza: this.#rareza,
      costoHumanidad: this.#costoHumanidad,
      poder: this.#poder,
      tipo: this.constructor.name,
      activacion: this.activarMecanismo(),
    };
  }
}
