// Esta parte del codigo es la nueva, utilizando JSON y Storage con eventos, el resto comentado, fueron entregadas en proyecto anterior. Por eso la etiqueta de formularioViejo.JS no esta añadida


//Constantes y variables
const formulario = document.getElementById('formulario');
const botonSolicitarTurno = document.getElementById('botonSolicitarTurno');
const containerReservas = document.getElementById('containerTurnos');
const verReservas = document.getElementById('verTurnos');
const verFechas = document.getElementById('verFechas');
const botonEliminar = document.getElementById('eliminarTurnos');
const botonIngresarAdmin = document.getElementById('botonIngresoAdmin');
let today = new Date();
let reservas = [];
let listaDeMedicos = [];
let doctoresFiltrados = [] ;

//Si el localstorage tiene datos, los meto al array de Reservas
if (localStorage.getItem('reservas')) {
    let reserva = JSON.parse(localStorage.getItem('reservas'));

    for (let i = 0; i < reserva.length; i++) {
        reservas.push(reserva[i]);
    }
};

//Creo el objeto Reserva donde se va a guardar el dato de cada persona
class Reserva {
    constructor(nombre, apellido,id, area, turno, calendario, diaregistro){
        this.nombre = nombre;
        this.apellido = apellido;
        this.id = id;
        this.area = area;
        this.turno = turno;
        this.calendario = calendario;
        this.diaregistro = diaregistro;
    }
};

//Funciones utilizadas
//Con esta funcion, agarro el objeto Reserva, y lo meto dentro del array Reservas para que queden guardados en el LS
function agregarReserva() {
    const nombre = document.getElementById('inputNombre').value;
    const apellido = document.getElementById('inputApellido').value;
    const id = document.getElementById('inputID').value;
    const area = document.getElementById('area').value;
    const turno = document.getElementById('turno').value;
    const calendario = document.getElementById('calendario').value;
    const diaregistro = today;
    const nuevaReserva = new Reserva(nombre, apellido, id, area, turno, calendario, diaregistro);
    reservas.push(nuevaReserva);

    localStorage.setItem('reservas',JSON.stringify(reservas));
    formulario.reset();
};

function mostrarTurnos() {
    containerMostrarTurnos.innerHTML = '';
    reservas.forEach((reserva) => {
        const div = document.createElement('div');
        div.innerHTML = `
                        <div>
                            <p>Nombre del paciente: ${reserva.nombre}</p>
                            <p>Apellido del paciente: ${reserva.apellido}</p>
                            <p>ID del paciente: ${reserva.id}</p>
                            <p>Fecha del turno: ${reserva.calendario}</p>
                            <p>El turno fue registrado: ${reserva.diaregistro}</p>
                        </div>
                        `
        document.getElementById("containerMostrarTurnos").classList.add('estiloMostrar')
        containerMostrarTurnos.appendChild(div);
    })
};

function mostrarFechasOcupadas() {
    containerMostrarFO.innerHTML = '';
    reservas.forEach((reserva) => {
        const div = document.createElement('div');
        div.innerHTML = `
                        <div>
                            <p>Las fechas ocupadas son: ${reserva.calendario} para ${reserva.area} en el turno ${reserva.turno}</p>
                        </div>
                        `
    document.getElementById("containerMostrarFO").classList.add('estiloMostrar')
    containerMostrarFO.appendChild(div);
    })
};

//JS PARA EL ADMIN
function ingresarComoAdmin() {
    const inputNombreAdmin = document.getElementById('inputNombreAdmin').value;
    const inputIDAdmin = document.getElementById('inputIDAdmin').value;
    if (inputNombreAdmin === "ADMIN" && inputIDAdmin === "123456"){
        
        document.getElementById("eliminarTurnos").classList.remove('botonesDeAdmin');
        document.getElementById("verTurnos").classList.remove('botonesDeAdmin');
    }
    else {
        alert('admin incorrecto')
    }
}

function eliminarTurnos() {
    localStorage.clear(); 
    reservas = [];
};

//Usando el JSON con FETCH
fetch('./datos/doctores.json')
.then(res => res.json())
.then(data => { 
        listaDeMedicos = data.doctores;
        for( let i=0; i< listaDeMedicos.length ; i++){
            console.log(listaDeMedicos[i]);
        };
    });

function filtrarTodosLosDoctores(){
    const areaMedico = document.getElementById('area').value;
    const turnoMedico = document.getElementById('turno').value;
    doctoresFiltrados = listaDeMedicos.filter((elemento) => (elemento.area === areaMedico && elemento.turno === turnoMedico));
};

//HOVER PARA LOS BOTONES
$(document).ready(function(){
    $("button").hover(function(){
      $(this).css("background-color", "grey");
      }, function(){
      $(this).css("background-color", "");
    });
  });

  $(document).ready(function(){
    $("#eliminarTurnos").hover(function(){
      $(this).css("background-color", "red");
      }, function(){
      $(this).css("background-color", "");
    });
  });

// LLAMADO DE FUNCIONES
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    filtrarTodosLosDoctores();
    if( doctoresFiltrados.length>0 ){
        alert('Hay doctores disponibles');
        agregarReserva();
        alert('Turno Reservado');
    } else {
        alert('No hay doctores disponibles')
    }
});

verReservas.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarTurnos();

});

verFechas.addEventListener('click',(e) => {
    e.preventDefault();
    mostrarFechasOcupadas();
});

botonEliminar.addEventListener('click',(e) => {
    eliminarTurnos();
});

botonIngresarAdmin.addEventListener('click', (e) => {
    e.preventDefault();
    ingresarComoAdmin();
});
