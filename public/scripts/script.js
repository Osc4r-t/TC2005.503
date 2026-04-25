let paises = [];

const emailInput = document.getElementById("email");
const nombreInput = document.getElementById("nombre");
const loginButton = document.getElementById("login_button");
const mensajeError = document.getElementById("mensaje-error");
const radioButtons = document.querySelectorAll('input[name="opcion"]');
const seleccionUbicacion = document.getElementById("seleccion_ubicacion");
const tipoUsuarioTexto = document.getElementById("tipo-usuario");
const selectPais = document.getElementById("select_pais");
const selectRegion = document.getElementById("select_region");
const terminosCheckbox = document.getElementById("terminos");
const emailsCheckbox = document.getElementById("emails");
const botonEnviar = document.getElementById("boton-enviar");
const resumenEnvio = document.getElementById("resumen-envio");

// Valida el usuario de prueba y redirige al perfil si es correcto.
function login() {
    const email = emailInput.value.trim();
    const nombre = nombreInput.value.trim();

    if (email === "email@email.com" && nombre === "nombre") {
        window.location.href = "./profile.html";
        return;
    }

    if (mensajeError) {
        mensajeError.hidden = false;
        mensajeError.textContent = "Usuario o contraseña no válidos.";
    }
}

// Muestra la sección de país y región cuando se elige un tipo de usuario.
function showLocation() {
    const opcionSeleccionada = document.querySelector('input[name="opcion"]:checked');

    if (seleccionUbicacion) {
        seleccionUbicacion.hidden = false;
    }

    if (tipoUsuarioTexto && opcionSeleccionada) {
        tipoUsuarioTexto.hidden = false;
        tipoUsuarioTexto.textContent = "Tipo de usuario: " + opcionSeleccionada.value;
    }
}

// Activa el botón Enviar solo cuando se aceptan los términos.
function activarEnviar() {
    if (!botonEnviar || !terminosCheckbox) {
        return;
    }

    botonEnviar.disabled = !terminosCheckbox.checked;

    if (emailsCheckbox && emailsCheckbox.checked) {
        console.log("El usuario aceptó recibir correos.");
    }
}

// Muestra en pantalla y consola un resumen simple del formulario.
function enviar() {
    const opcionSeleccionada = document.querySelector('input[name="opcion"]:checked');
    const resumen = {
        email: emailInput ? emailInput.value.trim() : "",
        nombre: nombreInput ? nombreInput.value.trim() : "",
        tipoUsuario: opcionSeleccionada ? opcionSeleccionada.value : "No seleccionado",
        pais: selectPais ? selectPais.options[selectPais.selectedIndex].text : "No seleccionado",
        region: selectRegion ? selectRegion.options[selectRegion.selectedIndex].text : "No seleccionado",
        aceptoTerminos: terminosCheckbox ? terminosCheckbox.checked : false,
        quiereEmails: emailsCheckbox ? emailsCheckbox.checked : false
    };

    console.log("Resumen del formulario:", resumen);

    if (resumenEnvio) {
        resumenEnvio.hidden = false;
        resumenEnvio.textContent = "Formulario enviado para " + resumen.nombre + " (" + resumen.tipoUsuario + ").";
    }
}

// Carga el archivo JSON con países y regiones.
function loadJson() {
    if (!selectPais || !selectRegion) {
        return;
    }

    fetch("./data.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            paises = data;
            llenarPaises();
        })
        .catch(function(error) {
            console.error("No se pudo cargar data.json", error);
        });
}

// Llena el dropdown de países con los datos del JSON.
function llenarPaises() {
    selectPais.innerHTML = '<option value="">Selecciona un país</option>';

    paises.forEach(function(pais) {
        const option = document.createElement("option");
        option.value = pais.countryShortCode;
        option.textContent = pais.countryName;
        selectPais.appendChild(option);
    });
}

// Limpia y llena las regiones según el país seleccionado.
function cargarRegiones() {
    if (!selectPais || !selectRegion) {
        return;
    }

    const paisSeleccionado = paises.find(function(pais) {
        return pais.countryShortCode === selectPais.value;
    });

    selectRegion.innerHTML = '<option value="">Selecciona una región</option>';

    if (!paisSeleccionado) {
        return;
    }

    paisSeleccionado.regions.forEach(function(region) {
        const option = document.createElement("option");
        option.value = region.shortCode;
        option.textContent = region.name;
        selectRegion.appendChild(option);
    });
}

if (loginButton && emailInput && nombreInput) {
    loginButton.addEventListener("click", login);
}

radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener("change", showLocation);
});

if (terminosCheckbox) {
    terminosCheckbox.addEventListener("change", activarEnviar);
}

if (emailsCheckbox) {
    emailsCheckbox.addEventListener("change", activarEnviar);
}

if (botonEnviar) {
    botonEnviar.addEventListener("click", enviar);
}

if (selectPais) {
    selectPais.addEventListener("change", cargarRegiones);
}

activarEnviar();
loadJson();
