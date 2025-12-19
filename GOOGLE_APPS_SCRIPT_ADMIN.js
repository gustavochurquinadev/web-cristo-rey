// ----------------------------------------------------------------
// 🎓 SCRIPT DE GESTIÓN ACADÉMICA (ADMIN) - COLEGIO CRISTO REY
// ----------------------------------------------------------------
// INSTRUCCIONES:
// 1. Crea un nuevo proyecto en script.google.com
// 2. Pega este código.
// 3. Ejecuta 'SETUP_ADMIN_DEMO' para crear la base de datos 'LEGAJOS_2026'.
// 4. Implementa como App Web (Acceso: Cualquiera - para que la web pueda leer/escribir).

const SHEET_ID_LEGAJOS = "PONER_ID_AQUI_SI_YA_TIENES_HOJA";

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const data = JSON.parse(e.postData.contents);
        const props = PropertiesService.getScriptProperties();
        const sheetId = SHEET_ID_LEGAJOS !== "PONER_ID_AQUI_SI_YA_TIENES_HOJA" ? SHEET_ID_LEGAJOS : props.getProperty('SHEET_ID_LEGAJOS');

        if (!sheetId) return response({ status: "error", message: "Error Config: Ejecuta SETUP_ADMIN_DEMO" });

        const ss = SpreadsheetApp.openById(sheetId);
        const sheet = ss.getSheetByName("Legajos 2026");

        // --- ACCIÓN: OBTENER TODOS LOS ALUMNOS ---
        if (data.action === "getAll") {
            const rows = sheet.getDataRange().getValues();
            const headers = rows[0];
            const students = rows.slice(1).map((r, i) => ({
                id: i + 2, // Fila real en la hoja
                dni: r[0],
                apellido: r[1],
                nombre: r[2],
                nivel: r[3],
                grado: r[4],
                division: r[5],
                turno: r[6],
                estado: r[7]
            })).filter(s => s.dni !== ""); // Filtrar vacíos

            return response({ status: "success", students: students });
        }

        // --- ACCIÓN: CREAR ALUMNO ---
        if (data.action === "create") {
            // DNI, APELLIDO, NOMBRE, NIVEL, GRADO, DIV, TURNO, ESTADO
            sheet.appendRow([
                data.student.dni,
                data.student.apellido,
                data.student.nombre,
                data.student.nivel,
                data.student.grado,
                data.student.division,
                data.student.turno,
                "Regular"
            ]);
            return response({ status: "success", message: "Alumno creado" });
        }

        // --- ACCIÓN: BORRAR (BAJA) ---
        if (data.action === "delete") {
            // data.id es el número de fila
            const rowIndex = parseInt(data.id);
            sheet.getRange(rowIndex, 8).setValue("Baja"); // Columna H es Estado (8)
            return response({ status: "success", message: "Alumno dado de baja" });
        }

        // --- MAGIA: PROMOCIÓN AUTOMÁTICA ---
        if (data.action === "promoteAll") {
            const range = sheet.getDataRange();
            const values = range.getValues(); // Incluye headers

            // Empezamos desde fila 1 (no headers)
            for (let i = 1; i < values.length; i++) {
                let row = values[i];
                let nivel = row[3];
                let grado = parseInt(row[4]);
                let estado = row[7];

                if (estado === "Baja" || estado === "Egresado") continue;

                // LÓGICA DE PROMOCIÓN
                if (nivel === "Inicial" && grado === 5) {
                    // Pasa a Primaria 1
                    sheet.getRange(i + 1, 4).setValue("Primario");
                    sheet.getRange(i + 1, 5).setValue(1);
                } else if (nivel === "Primario" && grado === 7) {
                    // Pasa a Secundaria 1
                    sheet.getRange(i + 1, 4).setValue("Secundario");
                    sheet.getRange(i + 1, 5).setValue(1);
                } else if (nivel === "Secundario" && grado === 5) {
                    // Egresa
                    sheet.getRange(i + 1, 8).setValue("Egresado");
                } else {
                    // Sube de grado (si es numérico)
                    if (!isNaN(grado)) {
                        sheet.getRange(i + 1, 5).setValue(grado + 1);
                    }
                }
            }
            return response({ status: "success", message: "¡Ciclo Lectivo Cerrado! Alumnos promovidos." });
        }

    } catch (error) {
        return response({ status: "error", message: error.toString() });
    } finally {
        lock.releaseLock();
    }
}

function response(data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function SETUP_ADMIN_DEMO() {
    const ss = SpreadsheetApp.create("ADMIN - Legajos Cristo Rey");
    const sheet = ss.getActiveSheet();
    sheet.setName("Legajos 2026");

    sheet.appendRow(["DNI", "APELLIDO", "NOMBRE", "NIVEL", "GRADO", "DIVISION", "TURNO", "ESTADO"]);

    // Datos Semilla
    sheet.appendRow(["1001", "Gómez", "Thiago", "Inicial", 5, "A", "Mañana", "Regular"]);
    sheet.appendRow(["2001", "Pérez", "Sofía", "Primario", 7, "B", "Tarde", "Regular"]);
    sheet.appendRow(["3001", "López", "Mateo", "Secundario", 4, "A", "Mañana", "Regular"]);
    sheet.appendRow(["3002", "Díaz", "Valentina", "Secundario", 5, "B", "Mañana", "Regular"]);

    sheet.getRange(1, 1, 1, 8).setBackground("#2e7d32").setFontColor("white").setFontWeight("bold");
    sheet.autoResizeColumns(1, 8);

    PropertiesService.getScriptProperties().setProperty('SHEET_ID_LEGAJOS', ss.getId());

    Logger.log("✅ BASE DE DATOS CREADA: " + ss.getUrl());
}
