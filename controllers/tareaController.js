import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"
import mongoose from "mongoose"

const agregarTarea = async(req, res) => {
    const { proyecto} = req.body

    const valid = mongoose.Types.ObjectId.isValid(proyecto)

    if(!valid){
       const error = new Error("No se encontro el proyecto")
       return res.status(404).json({msg: error.message})
    }

    const existeProyecto = await Proyecto.findById(proyecto)

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tienes los permisos para añadir tareas")
        return res.status(403).json({msg: error.message})
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body)
        // Almacenar el Id en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }
}

const obtenerTarea = async(req, res) => {
    const {id} = req.params
    const valid = mongoose.Types.ObjectId.isValid(id)

    if(!valid){
        const error = new Error("No existe la tarea")
        return res.status(404).json({msg: error.message})
     }

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tienes los permisos para ver esta tarea, debes ser el creador")
        return res.status(403).json({msg: error.message})
    }

    res.json(tarea)
}

const actualizarTarea = async(req, res) => {
    const {id} = req.params
    const valid = mongoose.Types.ObjectId.isValid(id)

    if(!valid){
        const error = new Error("No existe la tarea")
        return res.status(404).json({msg: error.message})
     }

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tienes los permisos para editar esta tarea, debes ser el creador")
        return res.status(403).json({msg: error.message})
    }
    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.prioridad = req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega
    try {
        const tareaAlmacenada = await tarea.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }
}

const eliminarTarea = async(req, res) => {
    const {id} = req.params
    const valid = mongoose.Types.ObjectId.isValid(id)

    if(!valid){
        const error = new Error("No existe la tarea")
        return res.status(404).json({msg: error.message})
     }

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tienes los permisos para eliminar esta tarea, debes ser el creador")
        return res.status(403).json({msg: error.message})
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)
        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])
        res.json({msg: "La Tarea se eliminó correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const cambiarEstado = async(req, res) => {
    const {id} = req.params
    const tarea = await Tarea.findById(id).populate('proyecto')

    if(!tarea){
        const error = new Error("No existe la tarea")
        return res.status(404).json({msg: error.message})
     }

     if(
        tarea.proyecto.creador.toString() !== req.usuario._id.toString() && 
        !tarea.proyecto.colaboradores.some(
            (colabordor) => colabordor._id.toString()  === req.usuario._id.toString()
        )
     ){
        const error = new Error('Acción no valida')
        return res.status(403).json({msg: error.message})
     }

     tarea.estado = !tarea.estado
     tarea.completado = req.usuario._id
     await tarea.save()

     const tareaAlmacenada = await Tarea.findById(id)
        .populate('proyecto')
        .populate('completado')

     res.json(tareaAlmacenada)
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}