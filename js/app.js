// Importa la función de Firestore para agregar documentos
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firestoreConfig';

// Menu ↓
let botonMas = document.getElementById("botonMas_id");
let menu = document.getElementById("id_menu");
let filtroParaMenuBorroso = document.getElementById("botonMas_id");

// Formulario ↓
let formulario = document.getElementById("section_formulario_id");
let botonAgregarTarea = document.getElementById("boton_agregarTarea_id");

// Asigno eventos click al boton del formulario ↓
botonAgregarTarea.addEventListener("click", agregarTarea);

// Modal de cargando
const modalCarga = document.getElementById('modalCarga');

// Array para ir guardando las cards ↓
let unaCard = [];

// Definir que se muestra en pantalla con los botones del menú ↓
let mostrarTodas = document.getElementById("id_todas");
let mostrarPendientes = document.getElementById("id_pendientes");
let mostrarFinalizadas = document.getElementById("id_finalizadas");
let mostrarCanceladas = document.getElementById("id_canceladas");
let muestraPantalla = "Todas";
let pantallaActual = "Todas";

// Asigno eventos click a los botones del menú ↓
botonMas.addEventListener("click", mostrarFormulario);
mostrarTodas.addEventListener("click", () => {muestraPantalla="Todas", cardsEnPantalla(muestraPantalla)})
mostrarPendientes.addEventListener("click", () => {muestraPantalla="Pendientes", cardsEnPantalla(muestraPantalla)})
mostrarFinalizadas.addEventListener("click", () => {muestraPantalla="Finalizadas", cardsEnPantalla(muestraPantalla)})
mostrarCanceladas.addEventListener("click", () => {muestraPantalla="Canceladas", cardsEnPantalla(muestraPantalla)})

// Secciones de las cards ↓
let todasCards = document.getElementById("todas-cards");
let pendientesCards = document.getElementById("pendientes-cards");
let finalizadasCards = document.getElementById("finalizadas-cards");
let canceladasCards = document.getElementById("canceladas-cards");

//Ventana modal de cards grandes ↓
let modalCard = document.getElementById("cardEnModal")
let modalFooter = document.getElementById("modal_footerID")





class Tarjetas {
  constructor(titulo, detalle, urgencia, fechaCreacion, fechaCierre, ultimaEdicion, estado) {
    this.titulo = titulo;
    this.detalle = detalle;
    this.urgencia = urgencia;
    this.fechaCreacion = fechaCreacion;
    this.fechaCierre = fechaCierre;
    this.ultimaEdicion = ultimaEdicion;
    this.estado = estado;
    this.id = null; // Inicializamos el ID como nulo
  }

  asignarId(id) {
    this.id = id;
  }
}






// Defino que se va a ver en pantalla
async function cardsEnPantalla(loQueQuieroQueMuestre) {
  mostrarCarga();
switch (loQueQuieroQueMuestre) {
    case "Todas":
      mostrarCanceladas.classList.remove("opcionElegidaDelMenu");
      mostrarFinalizadas.classList.remove("opcionElegidaDelMenu");
      mostrarPendientes.classList.remove("opcionElegidaDelMenu");
      mostrarTodas.classList.add("opcionElegidaDelMenu");

      pantallaActual = "Todas"; //Para mantenerme en la misma pantalla
      await obtenerCardsDesdeFirestore(pantallaActual); // Obtener las cards desde Firestore
      
      break;

    case "Pendientes":
      pantallaActual = "Pendientes";
      mostrarCanceladas.classList.remove("opcionElegidaDelMenu");
      mostrarFinalizadas.classList.remove("opcionElegidaDelMenu");
      mostrarTodas.classList.remove("opcionElegidaDelMenu");
      mostrarPendientes.classList.add("opcionElegidaDelMenu");

      await obtenerCardsDesdeFirestore(pantallaActual);
      
      break;

    case "Finalizadas":
      mostrarCanceladas.classList.remove("opcionElegidaDelMenu");
      mostrarTodas.classList.remove("opcionElegidaDelMenu");
      mostrarPendientes.classList.remove("opcionElegidaDelMenu");
      mostrarFinalizadas.classList.add("opcionElegidaDelMenu");

      pantallaActual = "Finalizadas";
      await obtenerCardsDesdeFirestore(pantallaActual);
      
      break;

    case "Canceladas":
      mostrarTodas.classList.remove("opcionElegidaDelMenu");
      mostrarFinalizadas.classList.remove("opcionElegidaDelMenu");
      mostrarPendientes.classList.remove("opcionElegidaDelMenu");
      mostrarCanceladas.classList.add("opcionElegidaDelMenu");

      pantallaActual = "Canceladas";
      await obtenerCardsDesdeFirestore(pantallaActual);
      
      break;

    default:
      break;
}
ocultarCarga();
}







// Nueva función para obtener las cards desde Firestore
async function obtenerCardsDesdeFirestore(estado) {
  mostrarCarga();
// Limpiar el array de cards antes de obtener las nuevas desde Firestore
actualizarCards();
unaCard = [];

// Obtener todas las tareas desde Firestore
const querySnapshot = await getDocs(collection(db, 'tareas'));

// Iterar sobre las tareas y agregarlas al array y al contenedor
querySnapshot.forEach((doc) => {
  const tarjetaFirestore = doc.data();
  if (tarjetaFirestore.estado === estado) {
    tarjetaFirestore.id = doc.id;
    unaCard.push(tarjetaFirestore);
  
    // Agregar la nueva card al contenedor correspondiente
    agregarCardAlContenedor(tarjetaFirestore);
  } else if (pantallaActual === "Todas"){
    tarjetaFirestore.id = doc.id;
    unaCard.push(tarjetaFirestore);
  
    // Agregar la nueva card al contenedor correspondiente
    agregarCardAlContenedor(tarjetaFirestore);
  }
ocultarCarga();
});
}




// Mostrar el modal de carga
function mostrarCarga() {
  modalCarga.style.display = 'flex';
}





// Ocultar el modal de carga
function ocultarCarga() {
  modalCarga.style.display = 'none';
}






// Funcion para mostrar u ocultar el formulario, poniendo borroso lo demás
function mostrarFormulario() {
  formulario.classList.toggle("oculto");

  if (formulario.classList.contains("oculto")) {
    botonMas.textContent = "+";
    botonMas.classList.add("botonMas_class");
    botonMas.classList.remove("boton_x");

    menuBorroso ();
  } else {
    botonMas.textContent = "x";
    botonMas.classList.remove("botonMas_class");
    botonMas.classList.add("boton_x");

    menuBorroso ();
  }
}





// Función para poner/sacar lo borroso
function menuBorroso () {
  if (formulario.classList.contains("oculto")) {
    // Saco el menú borroso
    mostrarCanceladas.classList.remove("menu_borroso");
    mostrarFinalizadas.classList.remove("menu_borroso");
    mostrarPendientes.classList.remove("menu_borroso");
    mostrarTodas.classList.remove("menu_borroso");

  } else {
    // Pongo el menú borroso
    mostrarCanceladas.classList.add("menu_borroso");
    mostrarFinalizadas.classList.add("menu_borroso");
    mostrarPendientes.classList.add("menu_borroso");
    mostrarTodas.classList.add("menu_borroso");

  }
}





// Funcion para cuando agrego una tarea, y debo ocultar el formulario y sacar lo borroso
function ocultarFormulario() {
  formulario.classList.add("oculto");
  botonMas.textContent = "+";
  botonMas.classList.add("botonMas_class");
  botonMas.classList.remove("boton_x");

  for (var i = 0; i < menu.children.length; i++) {
    var hijo = menu.children[i];

    // Verificar si el hijo es un enlace (<a>)
    if (hijo.tagName.toLowerCase() === "a") {
      hijo.classList.remove("menu_borroso");
    }
  }
}





// Función para vaciar campos del formulario
function vaciarCampos() {
  let tituloInput = document.getElementById("tareaTitulo");
  let detalleInput = document.getElementById("tareaDetalle");
  let urgenciaInput = document.getElementById("tareaUrgencia");

  tituloInput.value = "";
  detalleInput.value = "";
  urgenciaInput.value = "";
}




async function agregarTarea(event) {
  mostrarCarga();
  event.preventDefault();
  mostrarCarga();
  let fecha = new Date();
  let formatoFechaCreacion = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

  let titulo = document.getElementById("tareaTitulo").value;
  let detalle = document.getElementById("tareaDetalle").value;
  let urgencia = document.getElementById("tareaUrgencia").value;
  let fechaCreacion = fecha.toLocaleTimeString('es-AR', formatoFechaCreacion);
  let fechaCierre = "-";
  let ultimaEdicion = fecha.toLocaleTimeString('es-AR', formatoFechaCreacion);
  let estado = "Pendientes";

  if (!titulo || !detalle || !urgencia || !fechaCreacion || !ultimaEdicion) {
    alert("No completaste todo");
    ocultarCarga();
  } else {
    let nuevaCard = new Tarjetas(titulo, detalle, urgencia, fechaCreacion, fechaCierre, ultimaEdicion, estado);
    unaCard.push(nuevaCard);

    try {
      let docRef = await addDoc(collection(db, 'tareas'), {
        titulo: nuevaCard.titulo,
        detalle: nuevaCard.detalle,
        urgencia: nuevaCard.urgencia,
        fechaCreacion: nuevaCard.fechaCreacion,
        fechaCierre: nuevaCard.fechaCierre,
        ultimaEdicion: nuevaCard.ultimaEdicion,
        estado: nuevaCard.estado
      });

      // Asignar el ID generado por Firestore a la tarjeta
      nuevaCard.asignarId(docRef.id);
      console.log(docRef.id)
      console.log(unaCard)
      console.log(nuevaCard)
            // Agregar la nueva card al contenedor correspondiente
            agregarCardAlContenedor(nuevaCard);
            ocultarFormulario();
            vaciarCampos();
            menuBorroso();
            ocultarCarga();
            cardsEnPantalla("Pendientes");


            
    } catch (error) {
      console.error("Error al agregar la tarea a Firestore", error);
      ocultarCarga();
    }
    ocultarCarga();

  }
}





  //Función para asignar los eventos a los botones de las cards ↓
function init() {
  // Asignar eventos a los botones
  document.addEventListener("click", (event) => {
      // Verificar si el clic ocurrió en un botón de editar
      if (event.target.id.startsWith("editar-")) {
          // Extraer el ID de la tarea de la identificación del botón
          botonParaEditar(event.target.id.split("-")[1]);
      } 
      // Verificar si el clic ocurrió en un botón de finalizar
      else if (event.target.id.startsWith("finalizar-")) {
          // Extraer el ID de la tarea de la identificación del botón
          finalizarTarea(event.target.id.split("-")[1]);
      } 
      // Verificar si el clic ocurrió en un botón de cancelar
      else if (event.target.id.startsWith("cancelar-")) {
          // Extraer el ID de la tarea de la identificación del botón
          cancelarTarea(event.target.id.split("-")[1]);
      }// Verificar si el clic ocurrió en un botón de opciones
      else if (event.target.id.startsWith("opciones-")) {
        // Extraer el ID de la tarea de la identificación del botón
        masOpciones(event.target.id.split("-")[1]);
    }// Verificar si el clic ocurrió en un botón de eliminar
    else if (event.target.id.startsWith("eliminar-")) {
      // Extraer el ID de la tarea de la identificación del botón
      eliminar(event.target.id.split("-")[1]);
  }
  });
}


init();


// Renderizo la card, dependiendo su estado
function agregarCardAlContenedor(tarea) {
  // Genera un ID único para el div (card) basado en el ID de la tarea
  let cardID = `card-${tarea.id}`;
  // let tituloID = `titulo-${tarea.id}`;
  // let detalleID = `detalle-${tarea.id}`;
  let botonFinalizarID = `finalizar-${tarea.id}`;
  let botonMasOpcionesID = `opciones-${tarea.id}`;

  let nuevaCardHTML = `
    <div id="${cardID}" class="cards">
      <h3>${tarea.titulo}</h3>
      <p class="p_detalle">${tarea.detalle}</p>
      <p>URGENCIA: <br> ${tarea.urgencia}</p>
      <p>CREACIÓN: <br> ${tarea.fechaCreacion}</p>
      <p>FIN: <br> ${tarea.fechaCierre}</p>
      <button id="${botonFinalizarID}" class="btn botonesCards" >Finalizar</button>
      <button id="${botonMasOpcionesID}" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn botonesCards" >Opciones</button>
    </div>
  `;

  if (tarea.estado === "Pendientes") {
    pendientesCards.innerHTML += nuevaCardHTML;
  } else if (tarea.estado === "Finalizadas") {
    finalizadasCards.innerHTML += nuevaCardHTML;
  } else if (tarea.estado === "Canceladas") {
    canceladasCards.innerHTML += nuevaCardHTML;
  }
}






function masOpciones(id){
  let tarea = unaCard.find((t) => t.id === id);


    // Genera un ID único para el div (card) basado en el ID de la tarea
    let cardID = `card-${tarea.id}`;
    let tituloID = `titulo-${tarea.id}`;
    let detalleID = `detalle-${tarea.id}`;
    let botonEditarID = `editar-${tarea.id}`;
    let botonFinalizarID = `finalizar-${tarea.id}`;
    let botonCancelarID = `cancelar-${tarea.id}`;
    let botonEliminarID = `eliminar-${tarea.id}`;
  
    let nuevaCardHTML = `
    <div id="${cardID}" class="cards_modal">
    <h1 class="h3_modal" id="${tituloID}">${tarea.titulo}</h1>
    <p class="detalle_modal" id="${detalleID}">${tarea.detalle}</p>
        <div class="div_modales">
        <strong>URGENCIA → </strong>
        <p>${tarea.urgencia}</p>
        </div>
        <div class="div_modales">
        <strong>CREACIÓN → </strong>
        <p> ${tarea.fechaCreacion}</p>
        </div>
        <div class="div_modales">
        <strong>ÚLTIMA EDICIÓN → </strong>
        <p>${tarea.ultimaEdicion}</p>
        </div>
        <div class="div_modales">
        <strong>FIN → </strong>
        <p> ${tarea.fechaCierre}</p>
        </div>
  </div>
    `;

    let botonesCard = `
    <button id="${botonEditarID}" class="btn botonesCards_modal" >Editar</button>
    <button id="${botonFinalizarID}" class="btn botonesCards_modal" >Finalizar</button>
    <button id="${botonCancelarID}" class="btn botonesCards_modal" >Cancelar</button>
    <button id="${botonEliminarID}" class="btn botonesCards_modal" >Eliminar</button>
    `

modalCard.innerHTML = nuevaCardHTML;
modalFooter.innerHTML = botonesCard;

}






// Función para finalizar tarea de card
async function finalizarTarea(id) {
  var confirmacion = confirm("¿Seguro que querés finalizarla?")

  if(confirmacion){
    let fecha = new Date();
    let formatoFechaCierre = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
  // Buscar la tarea por su ID
  let tarea = unaCard.find((t) => t.id === id);
  let fondoDiv = document.getElementById(`card-${tarea.id}`);

  // Cambiar el estado y la fecha de cierre
  tarea.estado = "Finalizadas";
  muestraPantalla = tarea.estado;
  tarea.fechaCierre = fecha.toLocaleTimeString('es-AR', formatoFechaCierre);

    // Actualiza la tarea en Firestore
    const tareaRef = doc(db, 'tareas', id);
    await updateDoc(tareaRef, {
      estado: tarea.estado,
      fechaCierre: tarea.fechaCierre
    });

    cardsEnPantalla(pantallaActual);
  }
}




function eliminar(){
  alert("Todavía en proceso...");
}





// Función para cancelar una tarea
async function cancelarTarea(id) {

 var confirmacion = confirm("¿Seguro que querés cancelarla?")

 if(confirmacion){
    // Buscar la tarea por su ID
    let tarea = unaCard.find((t) => t.id === id);
    let botonEditar = document.getElementById(`editar-${tarea.id}`);
    let fecha = new Date();
    let formatoFechaCierre = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    tarea.fechaCierre = fecha.toLocaleTimeString('es-AR', formatoFechaCierre);
  
    // Cambiar el estado
    tarea.estado = "Canceladas";
    muestraPantalla = tarea.estado;

        // Actualiza la tarea en Firestore
        const tareaRef = doc(db, 'tareas', id);
        await updateDoc(tareaRef, {
          estado: tarea.estado,
          fechaCierre : tarea.fechaCierre
        });

    cardsEnPantalla(pantallaActual);
 }

}





// Función para editar una tarea
async function botonParaEditar(id) {
  // Buscar la tarea por su ID
  let tarea = unaCard.find((t) => t.id === id);

  //Me fijo fecha para después guardarla
  let fecha = new Date();
  let formatoFechaEdicion = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
  
  // Obtener la referencia al documento en Firestore
  const tareaRef = doc(db, "tareas", id);

  // Obtener los nuevos valores de los campos editados
  const fechaDeEdicion = fecha.toLocaleTimeString('es-AR', formatoFechaEdicion);
  const nuevoTitulo = document.getElementById(`titulo-${tarea.id}`).textContent;
  const nuevoDetalle = document.getElementById(`detalle-${tarea.id}`).textContent;

  console.log(fechaDeEdicion)

  // Obtener los elementos HTML correspondientes a los campos de título y detalle
  let detalleParaEditar = document.getElementById(`detalle-${tarea.id}`);
  let tituloParaEditar = document.getElementById(`titulo-${tarea.id}`);
  let botonEditar = document.getElementById(`editar-${tarea.id}`);

  // Verificar si estamos en modo de edición o no
  const verSiGuardoOEdito = botonEditar.textContent === "Guardar";

  if (verSiGuardoOEdito) {
    // Guardar cambios
    tarea.titulo = nuevoTitulo;
    tarea.detalle = nuevoDetalle;

    // Deshabilitar la edición en el DOM
    detalleParaEditar.classList.remove("fondo_input_editable");
    tituloParaEditar.classList.remove("fondo_input_editable");
    tituloParaEditar.contentEditable = false;
    detalleParaEditar.contentEditable = false;

    // Restaurar el botón de editar
    botonEditar.textContent = "Editar";

    try {
      // Realizar la actualización en Firestore
      await updateDoc(tareaRef, {
        titulo: nuevoTitulo,
        detalle: nuevoDetalle,
        ultimaEdicion: fecha.toLocaleTimeString('es-AR', formatoFechaEdicion)// Actualizar la fecha de última edición
      });


    } catch (error) {
      console.error("Error al actualizar el documento en Firestore", error);
    }
  } else {
    // Entrar en modo de edición
    detalleParaEditar.classList.add("fondo_input_editable"); //Pongo fondo de input blanco
    tituloParaEditar.classList.add("fondo_input_editable");
    tituloParaEditar.contentEditable = true;
    detalleParaEditar.contentEditable = true;
    detalleParaEditar.focus();

    // Cambiar el texto al botón editar y la función
    botonEditar.textContent = "Guardar";
  }
  cardsEnPantalla(muestraPantalla);
}






// Función para limpiar lo que se muestra en pantalla
function actualizarCards() {
  // Limpiar los contenedores
  todasCards.innerHTML = "";
  pendientesCards.innerHTML = "";
  finalizadasCards.innerHTML = "";
  canceladasCards.innerHTML = "";
}

