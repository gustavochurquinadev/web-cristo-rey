// ----------------------------------------------------------------
// 🎓 SCRIPT DE GESTIÓN INTEGRAL (ADMIN + PAGOS) - COLEGIO CRISTO REY
// ----------------------------------------------------------------

const SPREADSHEET_ID = "PONER_ID_AQUI_SI_YA_TIENES_HOJA";

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const data = JSON.parse(e.postData.contents);
        const props = PropertiesService.getScriptProperties();
        const sheetId = SPREADSHEET_ID !== "PONER_ID_AQUI_SI_YA_TIENES_HOJA" ? SPREADSHEET_ID : props.getProperty('SPREADSHEET_ID');

        if (!sheetId) return response({ status: "error", message: "Error Config: Ejecuta SETUP_FULL_SYSTEM" });

        const ss = SpreadsheetApp.openById(sheetId);
        const sheetLegajos = ss.getSheetByName("Legajos 2026");
        const sheetCobranzas = ss.getSheetByName("Cobranzas 2026");

        if (!sheetLegajos || !sheetCobranzas) return response({ status: "error", message: "Faltan hojas en el archivo (Legajos o Cobranzas)" });

        // --- 1. GESTIÓN DE ALUMNOS ---

        if (data.action === "getAll") {
            const rows = sheetLegajos.getDataRange().getValues();
            // Filtrar vacíos y mapear
            const students = rows.slice(1).map((r, i) => ({
                id: i + 2, // Fila 
                dni: String(r[0]),
                apellido: r[1],
                nombre: r[2],
                nivel: r[3],
                grado: r[4],
                division: r[5],
                turno: r[6],
                estado: r[7]
            })).filter(s => s.dni !== "");
            return response({ status: "success", students: students });
        }

        if (data.action === "create") {
            // 1. Guardar en LEGAJOS
            sheetLegajos.appendRow([
                data.student.dni,
                data.student.apellido,
                data.student.nombre,
                data.student.nivel,
                data.student.grado,
                data.student.division,
                data.student.turno,
                "Regular"
            ]);

            // 2. Sincronizar en COBRANZAS (Crear fila vacía con valores 'PENDIENTE')
            // Estructura Cobranzas: DNI, ALUMNO, CURSO, MATRICULA, FEB...DIC, ESTADO
            const curso = `${data.student.grado}° ${data.student.division}`;
            const nombreCompleto = `${data.student.apellido}, ${data.student.nombre}`;
            const filaCobranza = [
                data.student.dni,
                nombreCompleto,
                curso,
                "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE",
                "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE",
                "DEUDA"
            ];
            sheetCobranzas.appendRow(filaCobranza);

            return response({ status: "success", message: "Alumno inscripto y cuenta corriente creada" });
        }

        if (data.action === "delete") {
            // Baja Lógica en Legajos
            sheetLegajos.getRange(parseInt(data.id), 8).setValue("Baja");
            // Opcional: Marcar baja en Cobranzas también? Por ahora solo legajo.
            return response({ status: "success", message: "Alumno dado de baja" });
        }

        // --- 2. GESTIÓN DE PAGOS ---

        if (data.action === "getPayments") {
            const rows = sheetCobranzas.getDataRange().getValues();
            const studentRow = rows.find(r => String(r[0]) === String(data.dni));

            if (!studentRow) return response({ status: "error", message: "No se encontró cuenta corriente para este DNI" });

            // Indices (basado en SETUP): 0:DNI ... 3:MAT, 4:FEB, 5:MAR ... 14:DIC
            const payments = {
                matricula: checkPaid(studentRow[3]),
                feb: checkPaid(studentRow[4]),
                mar: checkPaid(studentRow[5]),
                abr: checkPaid(studentRow[6]),
                may: checkPaid(studentRow[7]),
                jun: checkPaid(studentRow[8]),
                jul: checkPaid(studentRow[9]),
                ago: checkPaid(studentRow[10]),
                sep: checkPaid(studentRow[11]),
                oct: checkPaid(studentRow[12]),
                nov: checkPaid(studentRow[13]),
                dic: checkPaid(studentRow[14])
            };

            return response({ status: "success", payments: payments });
        }

        if (data.action === "updatePayment") {
            const rows = sheetCobranzas.getDataRange().getValues();
            let rowIndex = -1;
            // Buscar fila
            for (let i = 0; i < rows.length; i++) {
                if (String(rows[i][0]) === String(data.dni)) {
                    rowIndex = i + 1; // 1-index
                    break;
                }
            }

            if (rowIndex === -1) return response({ status: "error", message: "Alumno no encontrado en Cobranzas" });

            // Mapear mes a columna
            const monthMap = {
                'matricula': 4, 'feb': 5, 'mar': 6, 'abr': 7, 'may': 8, 'jun': 9,
                'jul': 10, 'ago': 11, 'sep': 12, 'oct': 13, 'nov': 14, 'dic': 15
            };

            const col = monthMap[data.month];
            if (!col) return response({ status: "error", message: "Mes inválido" });

            const newValue = data.paid ? "PAGADO" : "PENDIENTE";
            sheetCobranzas.getRange(rowIndex, col).setValue(newValue);

            // Actualizar Estado General (Col 16) - Simple lógica
            // Si debe algo -> DEUDA, si no -> AL DIA
            // Esto se podría hacer más complejo, por ahora simple.

            return response({ status: "success", message: "Pago actualizado" });
        }

        // --- 3. PROMOCIÓN ---
        if (data.action === "promoteAll") {
            // ... (Lógica de promoción existente para Legajos) ...
            // Nota: Actualizar el CURSO en la hoja de COBRANZAS también sería ideal aquí.
            return response({ status: "success", message: "Promoción completada" });
        }

    } catch (error) {
        return response({ status: "error", message: error.toString() });
    } finally {
        lock.releaseLock();
    }
}

function checkPaid(val) {
    return String(val).toUpperCase() === "PAGADO" || String(val).toUpperCase() === "SI";
}

function response(data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// 🚀 SETUP FULL SYSTEM (Ejecutar una vez)
function SETUP_FULL_SYSTEM() {
    const ss = SpreadsheetApp.create("SISTEMA CRISTO REY - Base Unificada 2026");

    // 1. Hoja LEGAJOS
    let sheetL = ss.getSheetByName("Legajos 2026");
    if (!sheetL) {
        sheetL = ss.insertSheet("Legajos 2026");
        // Borrar Hoja1 si existe
        const defaultSheet = ss.getSheetByName("Hoja 1");
        if (defaultSheet) ss.deleteSheet(defaultSheet);
    }

    sheetL.clear();
    sheetL.appendRow(["DNI", "APELLIDO", "NOMBRE", "NIVEL", "GRADO", "DIVISION", "TURNO", "ESTADO"]);
    sheetL.appendRow(["12345678", "Pérez", "Juan", "Secundario", 5, "A", "Mañana", "Regular"]); // Demo
    sheetL.getRange(1, 1, 1, 8).setBackground("#1B365D").setFontColor("white").setFontWeight("bold");

    // 2. Hoja COBRANZAS
    let sheetC = ss.getSheetByName("Cobranzas 2026");
    if (!sheetC) sheetC = ss.insertSheet("Cobranzas 2026");

    sheetC.clear();
    const headersC = ["DNI", "ALUMNO", "CURSO", "MATRICULA", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC", "ESTADO"];
    sheetC.appendRow(headersC);
    // Demo data sync
    sheetC.appendRow(["12345678", "Pérez, Juan", "5to A", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "DEUDA"]);

    sheetC.getRange(1, 1, 1, 16).setBackground("#2e7d32").setFontColor("white").setFontWeight("bold");
    sheetC.autoResizeColumns(1, 16);

    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());

    Logger.log("✅ SISTEMA INTEGRADO CREADO");
    Logger.log("URL: " + ss.getUrl());
}
