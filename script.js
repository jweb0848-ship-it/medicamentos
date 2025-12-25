const medicamentos = [
    { nombre: "Inyección", horas: 24 },
    { nombre: "Dextrometorfano", horas: 8 },
    { nombre: "Ácido Ascórbico", horas: 24 }
];

window.onload = function() {
    const contenedor = document.getElementById('contenedorTarjetas');
    
    // Generar tarjetas
    medicamentos.forEach((med, index) => {
        const htmlTarjeta = `
            <div class="card">
                <h3>${med.nombre}</h3>
                <span class="frecuencia">Cada ${med.horas} horas</span>
                
                <label>Última dosis:</label>
                <input type="datetime-local" id="fecha-${index}">
                
                <div id="res-box-${index}" class="resultado-box">
                    <span class="res-label">Siguiente toma:</span>
                    <span class="res-fecha" id="texto-${index}"></span>
                </div>
            </div>
        `;
        contenedor.innerHTML += htmlTarjeta;
    });

    establecerHoraActual();
};

function establecerHoraActual() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const fechaLocal = now.toISOString().slice(0,16);

    const inputs = document.querySelectorAll('input[type="datetime-local"]');
    inputs.forEach(input => input.value = fechaLocal);
}

function calcularTodo() {
    const ahora = new Date();

    medicamentos.forEach((med, index) => {
        const inputId = `fecha-${index}`;
        const resBoxId = `res-box-${index}`;
        const textoId = `texto-${index}`;
        
        const fechaValor = document.getElementById(inputId).value;
        const boxResultado = document.getElementById(resBoxId);
        const textoResultado = document.getElementById(textoId);

        if (fechaValor) {
            const fechaUltima = new Date(fechaValor);
            const msPorHora = 60 * 60 * 1000;
            const fechaSiguiente = new Date(fechaUltima.getTime() + (med.horas * msPorHora));

            const opciones = { 
                weekday: 'long', 
                hour: 'numeric', minute: '2-digit', hour12: true 
            };
            
            let fechaTexto = fechaSiguiente.toLocaleDateString('es-ES', opciones);

            const esHoy = fechaSiguiente.getDate() === ahora.getDate() &&
                          fechaSiguiente.getMonth() === ahora.getMonth() &&
                          fechaSiguiente.getFullYear() === ahora.getFullYear();

            if (esHoy) {
                boxResultado.classList.add('alerta-hoy');
                textoResultado.innerHTML = "🚨 HOY a las " + fechaSiguiente.toLocaleTimeString('es-ES', {hour: 'numeric', minute:'2-digit', hour12:true});
            } else {
                boxResultado.classList.remove('alerta-hoy');
                fechaTexto = fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1);
                textoResultado.innerHTML = fechaTexto;
            }
            
            boxResultado.style.display = 'block';
        }
    });
}