import { useShallow } from "zustand/shallow"
import { tareaStore } from "../store/tareaStrore"
import { editarTarea, eliminarTareaPorID, getAllTareas, postNuevaTarea } from "../http/tareas";
import type { ITarea } from "../types/ITarea";
import Swal from "sweetalert2";


export const useTareas = () => {
    const {tareas, setArrayTareas, agregarNuevaTarea, eliminarUnaTarea, editarUnaTarea} = tareaStore(useShallow((state) => ({
        tareas: state.tareas,
        setArrayTareas: state.setArrayTareas,
        agregarNuevaTarea: state.agregarNuevaTarea,
        eliminarUnaTarea: state.eliminarUnaTarea,
        editarUnaTarea: state.editarUnaTarea,
    })));

    const getTareas = async() => {
            const data  = await getAllTareas();
            if(data) setArrayTareas(data);
    };

    const crearTarea = async (nuevaTarea:ITarea) => {
        agregarNuevaTarea(nuevaTarea);
        try{
            await postNuevaTarea(nuevaTarea);
            Swal.fire("Exito", "Tarea creada correctamente", "success");
        }catch (error){
            eliminarTarea(nuevaTarea.id!);
            console.log("Algo salio mal al crear la tarea");
        }
    };

    const putTareaEditar = async (tareaEditada:ITarea) => {
        const estadoPrevio = tareas.find((el) => el.id === tareaEditada.id);

        editarUnaTarea(tareaEditada);

        try{
             await editarTarea(tareaEditada);
             Swal.fire("Exito", "Tarea actualizada correctamente", "success");
        }catch(error){
            if(estadoPrevio) editarUnaTarea(estadoPrevio);
            console.log("Algo salio mal al editar");
        }
    };    

    const eliminarTarea = async (idTarea:string) => {
        const estadoPrevio = tareas.find((el) => el.id === idTarea);
        const confirm = await Swal.fire ({
            title: "¿Estas seguro?",
            text: "Esta accion no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
    });

        if (!confirm.isConfirmed)return;
        eliminarUnaTarea(idTarea);
        try{
            await eliminarTareaPorID(idTarea);
            Swal.fire("Eliminado", "Tarea eliminada correctamente", "success");
        }catch (error){
            if(estadoPrevio) agregarNuevaTarea(estadoPrevio);
            console.log("Algo salio mal al editar");
        }
    };

    return {
        getTareas, 
        crearTarea,
        putTareaEditar,
        eliminarTarea,
        tareas,
    };
};