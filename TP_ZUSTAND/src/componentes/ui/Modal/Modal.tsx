import {
  useEffect,
  useState,
  type ChangeEvent,
  type FC,
  type FormEvent,
} from "react";
import { tareaStore } from "../../../store/tareaStrore";
import styles from "./Modal.module.css";
import type { ITarea } from "../../../types/ITarea";
import { useTareas } from "../../../hooks/useTareas";

type IModal = {
  handleCloseModal: VoidFunction;
};

const intialState: ITarea = {
  titulo: "",
  descripcion: "",
  fechaLimite: "",
};

export const Modal: FC<IModal> = ({ handleCloseModal }) => {
  const tareaActiva = tareaStore((state) => state.tareaActiva);
  const setTareaActiva = tareaStore((state) => state.setTareaActiva);

  const { crearTarea, putTareaEditar } = useTareas();

  const [formValues, sertFormValues] = useState<ITarea>(intialState);

  useEffect(() => {
    if (tareaActiva) sertFormValues(tareaActiva);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    sertFormValues((prev) => ({ ...prev, [`${name}`]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (tareaActiva) {
      putTareaEditar(formValues);
    } else {
      crearTarea({ ...formValues, id: new Date().toDateString() });
    }
    setTareaActiva(null);
    handleCloseModal();
  };

  return (
    <div className={styles.containerPrincipalModal}>
      <div className={styles.contentPopUP}>
        <div>
          <h3>{tareaActiva ? "Editar Tarea" : "Crear Tarea"} </h3>
        </div>
        <form onSubmit={handleSubmit} className={styles.formContent}>
          <div>
            <input
              placeholder="Ingrese un titulo"
              type="text"
              required
              onChange={handleChange}
              value={formValues.titulo}
              autoComplete="off"
              name="titulo"
            />

            <textarea
              placeholder="Ingrese una descripcion"
              required
              onChange={handleChange}
              value={formValues.descripcion}
              name="descripcion"
            />

            <input
              type="date"
              required
              onChange={handleChange}
              value={formValues.fechaLimite}
              autoComplete="off"
              name="fechaLimite"
            />
          </div>
          <div className={styles.buttonCard}>
            <button className={styles.botonCancelar} onClick={handleCloseModal}>
              Cancelar
            </button>
            <button className={styles.botonEnviar} type="submit">
              {tareaActiva ? "Editar Tarea" : "Crear Tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
