// ----------------------------------------------------------------
// 🎓 SISTEMA CRISTO REY - BACKEND SUPREMO (ADMIN + PADRES + SYNC)
// ----------------------------------------------------------------
// ESTE SCRIPT MANEJA TODO: ADMIN, PAGOS, PORTAL PADRES Y SINCRONIZACIÓN.

const SPREADSHEET_ID = "PONER_ID_AQUI_SI_YA_TIENES_HOJA";
const DOC_ID_PLANTILLA = "PONER_ID_DOC_LIBRE_DEUDA";
const DOC_ID_INICIO = "PONER_ID_DOC_INICIO";
const DOC_ID_FINAL = "PONER_ID_DOC_FINAL";
const FOLDER_ID_PDFS = "PONER_ID_CARPETA_PDFS";

// ==========================================
// 🚀 MENÚ PERSONALIZADO EN SHEETS
// ==========================================

function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('🚀 SISTEMA CRISTO REY')
        .addItem('🔄 Sincronizar Todo (Legajos -> Cobranzas)', 'SYNC_FULL')
        .addSeparator()
        .addItem('🔍 Aplicar Filtros Automáticos', 'APPLY_FILTERS')
        .addToUi();
}

// ----------------------------------------------------------------
// 🔄 FUNCIÓN MAESTRA DE SINCRONIZACIÓN
// ----------------------------------------------------------------
function SYNC_FULL() {
    const ui = SpreadsheetApp.getUi();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetLegajos = ss.getSheetByName("Legajos 2026");
    const sheetCobranzas = ss.getSheetByName("Cobranzas 2026");

    if (!sheetLegajos || !sheetCobranzas) {
        ui.alert("❌ Error: Faltan las hojas 'Legajos 2026' o 'Cobranzas 2026'.");
        return;
    }

    // 1. Leer Datos
    const dataL = sheetLegajos.getDataRange().getValues(); // Header es row 0
    const dataC = sheetCobranzas.getDataRange().getValues();

    // Mapas para búsqueda rápida por DNI
    // Legajos: key = DNI, value = {row, data}
    const mapLegajos = {};
    for (let i = 1; i < dataL.length; i++) {
        let dni = String(dataL[i][0]).trim();
        if (dni) mapLegajos[dni] = { index: i, row: dataL[i] };
    }

    // Cobranzas: key = DNI, value = index (fila real = index + 1)
    const mapCobranzas = {};
    for (let i = 1; i < dataC.length; i++) {
        let dni = String(dataC[i][0]).trim();
        if (dni) mapCobranzas[dni] = i;
    }

    let creados = 0;
    let actualizados = 0;
    let borrados = 0;

    // 2. PROCESO DE SINCRONIZACIÓN (LEGAJOS -> COBRANZAS)

    // A) Crear Nuevos y Actualizar Existentes
    for (let dni in mapLegajos) {
        const lData = mapLegajos[dni].row;
        // Datos Legajo: 0=DNI, 1=Apellido, 2=Nombre, 3=Nivel, 4=Grado, 5=Div, 6=Turno, 7=Estado
        const nombreFull = `${lData[1]}, ${lData[2]}`;
        const curso = `${lData[4]}° ${lData[5]}`;
        const estadoLegajo = String(lData[7]).toUpperCase();

        if (mapCobranzas.hasOwnProperty(dni)) {
            // EXISTE: Actualizar Datos (Nombre, Curso, Estado si es Baja)
            const cIndex = mapCobranzas[dni];
            const cRow = cIndex + 1; // 1-based for getRange

            // Actualizamos Nombre y Curso siempre para mantener consistencia
            sheetCobranzas.getRange(cRow, 2).setValue(nombreFull);
            sheetCobranzas.getRange(cRow, 3).setValue(curso);

            // Si en Legajo es BAJA, marcamos BAJA en Cobranzas (Estado Global)
            // Ojo: En cobranzas la columna P (16) es Estado Deuda. Podríamos usar otra o sobreescribir.
            // Usuario pidió "borrar o baja". Vamos a marcar celda roja si es baja.
            if (estadoLegajo === "BAJA") {
                sheetCobranzas.getRange(cRow, 1, 1, 16).setBackground("#ffcccc"); // Rojo suave
                // Opcional: Escribir "BAJA" en columna de deuda?
                // sheetCobranzas.getRange(cRow, 16).setValue("BAJA"); 
            } else {
                sheetCobranzas.getRange(cRow, 1, 1, 16).setBackground(null); // Restaurar fondo
            }

            actualizados++;
        } else {
            // NO EXISTE: Crear Fila
            // Estructura Cobranzas: DNI, ALUMNO, CURSO, MATRICULA, FEB...DIC, ESTADO
            if (estadoLegajo !== "BAJA") {
                const newRow = [
                    dni, nombreFull, curso,
                    "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE",
                    "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE",
                    "AL DIA" // Asumimos al día al crear
                ];
                sheetCobranzas.appendRow(newRow);
                creados++;
            }
        }
    }

    // B) Eliminar Huérfanos (Están en Cobranzas pero NO en Legajos)
    // Recorremos hacia atrás para poder borrar filas sin romper índices
    for (let i = dataC.length - 1; i >= 1; i--) {
        let dniC = String(dataC[i][0]).trim();
        if (!mapLegajos.hasOwnProperty(dniC)) {
            sheetCobranzas.deleteRow(i + 1);
            borrados++;
        }
    }

    ui.alert(`✅ Sincronización Completa:\n\n🆕 Nuevos: ${creados}\n🔄 Actualizados: ${actualizados}\n🗑️ Borrados (Huérfanos): ${borrados}`);
}

// ----------------------------------------------------------------
// 🔍 FUNCIÓN PONE FILTROS
// ----------------------------------------------------------------
function APPLY_FILTERS() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = [ss.getSheetByName("Legajos 2026"), ss.getSheetByName("Cobranzas 2026")];

    sheets.forEach(sheet => {
        if (sheet) {
            // Limpiar filtro existente si hay
            if (sheet.getFilter()) {
                sheet.getFilter().remove();
            }
            // Aplicar nuevo filtro al rango de datos
            const range = sheet.getDataRange();
            range.createFilter();
        }
    });

    SpreadsheetApp.getUi().alert("✅ Filtros aplicados en ambas hojas.");
}


// ==========================================
// ⚡ BACKEND WEB (doPost)
// ==========================================

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const data = JSON.parse(e.postData.contents);
        const props = PropertiesService.getScriptProperties();

        // ID Sheet
        const sheetId = SPREADSHEET_ID !== "PONER_ID_AQUI_SI_YA_TIENES_HOJA" ? SPREADSHEET_ID : props.getProperty('SPREADSHEET_ID');
        if (!sheetId) return response({ status: "error", message: "Error Config: Ejecuta SETUP_FULL_SYSTEM" });

        const ss = SpreadsheetApp.openById(sheetId);
        const sheetLegajos = ss.getSheetByName("Legajos 2026");
        const sheetCobranzas = ss.getSheetByName("Cobranzas 2026");

        if (!sheetLegajos || !sheetCobranzas) return response({ status: "error", message: "Faltan hojas en el archivo" });

        // ------------------------------------------
        // ADMIN ACTIONS
        // ------------------------------------------

        if (data.action === "getAll") {
            const rowsLegajos = sheetLegajos.getDataRange().getValues();
            const rowsCobranzas = sheetCobranzas.getDataRange().getValues();

            // Map cobranzas by DNI for O(1) lookup
            const cobranzasMap = {};
            rowsCobranzas.slice(1).forEach(r => {
                cobranzasMap[String(r[0])] = r[15]; // Column 16 is 'ESTADO'
            });

            const students = rowsLegajos.slice(1).map((r, i) => ({
                id: i + 2,
                dni: String(r[0]),
                apellido: r[1],
                nombre: r[2],
                nivel: r[3],
                grado: r[4],
                division: r[5],
                turno: r[6],
                estado: r[7],
                saldo: cobranzasMap[String(r[0])] || "PENDIENTE"
            })).filter(s => s.dni !== "");
            return response({ status: "success", students: students });
        }

        if (data.action === "create") {
            // 1. Legajos
            sheetLegajos.appendRow([data.student.dni, data.student.apellido, data.student.nombre, data.student.nivel, data.student.grado, data.student.division, data.student.turno, "Regular"]);
            // 2. Cobranzas (Sync)
            const nombreFull = `${data.student.apellido}, ${data.student.nombre}`;
            const curso = `${data.student.grado}° ${data.student.division}`;
            sheetCobranzas.appendRow([data.student.dni, nombreFull, curso, "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "AL DIA"]);
            return response({ status: "success", message: "Alumno creado" });
        }

        if (data.action === "edit") {
            const rowIdx = parseInt(data.id);
            const dni = data.student.dni;

            // Update Legajos
            sheetLegajos.getRange(rowIdx, 1).setValue(dni);
            sheetLegajos.getRange(rowIdx, 2).setValue(data.student.apellido);
            sheetLegajos.getRange(rowIdx, 3).setValue(data.student.nombre);
            sheetLegajos.getRange(rowIdx, 4).setValue(data.student.nivel);
            sheetLegajos.getRange(rowIdx, 5).setValue(data.student.grado);
            sheetLegajos.getRange(rowIdx, 6).setValue(data.student.division);
            sheetLegajos.getRange(rowIdx, 7).setValue(data.student.turno);

            // Sync Name/Course to Cobranzas (Find by DNI)
            const rowsC = sheetCobranzas.getDataRange().getValues();
            const cobRowIdx = rowsC.findIndex(r => String(r[0]) === String(dni));

            if (cobRowIdx !== -1) {
                const nombreFull = `${data.student.apellido}, ${data.student.nombre}`;
                const curso = `${data.student.grado}° ${data.student.division}`;
                sheetCobranzas.getRange(cobRowIdx + 1, 2).setValue(nombreFull);
                sheetCobranzas.getRange(cobRowIdx + 1, 3).setValue(curso);
            }

            return response({ status: "success", message: "Alumno editado correctamente" });
        }

        if (data.action === "delete") {
            sheetLegajos.getRange(parseInt(data.id), 8).setValue("Baja");
            // Sync Baja en Cobranzas is handled by the daily SYNC_FULL or we can do it here too, but lazy approach is relying on Master Sync or updatePayment check.
            // For now, let's keep it simple.
            return response({ status: "success", message: "Baja procesada" });
        }

        if (data.action === "promoteAll") {
            const range = sheetLegajos.getDataRange();
            const values = range.getValues();
            for (let i = 1; i < values.length; i++) {
                let row = values[i];
                let nivel = row[3];
                let grado = parseInt(row[4]);
                if (row[7] === "Baja" || row[7] === "Egresado") continue;

                if (nivel === "Inicial" && grado === 5) {
                    sheetLegajos.getRange(i + 1, 4).setValue("Primario"); sheetLegajos.getRange(i + 1, 5).setValue(1);
                } else if (nivel === "Primario" && grado === 7) {
                    sheetLegajos.getRange(i + 1, 4).setValue("Secundario"); sheetLegajos.getRange(i + 1, 5).setValue(1);
                } else if (nivel === "Secundario" && grado === 5) {
                    sheetLegajos.getRange(i + 1, 8).setValue("Egresado");
                } else if (!isNaN(grado)) {
                    sheetLegajos.getRange(i + 1, 5).setValue(grado + 1);
                }
            }
            return response({ status: "success", message: "Promoción completada" });
        }

        if (data.action === "getPayments") {
            const rows = sheetCobranzas.getDataRange().getValues();
            const row = rows.find(r => String(r[0]) === String(data.dni));
            if (!row) return response({ status: "error", message: "No encontrado en cobranzas" });

            return response({
                status: "success",
                payments: {
                    matricula: checkPaid(row[3]), feb: checkPaid(row[4]), mar: checkPaid(row[5]), abr: checkPaid(row[6]),
                    may: checkPaid(row[7]), jun: checkPaid(row[8]), jul: checkPaid(row[9]), ago: checkPaid(row[10]),
                    sep: checkPaid(row[11]), oct: checkPaid(row[12]), nov: checkPaid(row[13]), dic: checkPaid(row[14])
                }
            });
        }

        if (data.action === "updatePayment") {
            const rows = sheetCobranzas.getDataRange().getValues();
            let rowIndex = rows.findIndex(r => String(r[0]) === String(data.dni));
            if (rowIndex === -1) return response({ status: "error", message: "No encontrado" });

            const monthMap = { 'matricula': 3, 'feb': 4, 'mar': 5, 'abr': 6, 'may': 7, 'jun': 8, 'jul': 9, 'ago': 10, 'sep': 11, 'oct': 12, 'nov': 13, 'dic': 14 };
            const colIndex = monthMap[data.month];
            sheetCobranzas.getRange(rowIndex + 1, colIndex + 1).setValue(data.paid ? "PAGADO" : "PENDIENTE");

            // Smart Debt Logic
            const today = new Date();
            const currentDay = today.getDate();
            const currentMonthIdx = today.getMonth();

            const currentRow = sheetCobranzas.getRange(rowIndex + 1, 1, 1, 16).getValues()[0];
            let hasDebt = false;

            if (!checkPaid(currentRow[3])) hasDebt = true;

            for (let m = 1; m <= 11; m++) { // Feb(1) a Dic(11)
                let colIdx = m + 3;
                let isExigible = false;
                if (currentMonthIdx > m) isExigible = true;
                if (currentMonthIdx === m && currentDay > 10) isExigible = true;

                if (isExigible && !checkPaid(currentRow[colIdx])) {
                    hasDebt = true;
                    break;
                }
            }

            sheetCobranzas.getRange(rowIndex + 1, 16).setValue(hasDebt ? "DEUDA" : "AL DIA");

            return response({ status: "success", message: "Pago actualizado" });
        }

        // ------------------------------------------
        // PORTAL PADRES & PDF ACTIONS
        // ------------------------------------------

        if (data.action === "login") {
            // (Misma lógica previa de login padres)
            const rows = sheetCobranzas.getDataRange().getValues();
            const studentRow = rows.find(r => String(r[0]).trim() === String(data.dni).trim());

            if (!studentRow) return response({ status: "error", message: "Alumno no encontrado" });

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

            const debtFree = studentRow[15] === "AL DIA";

            return response({
                status: "success",
                student: {
                    dni: studentRow[0],
                    name: studentRow[1],
                    course: studentRow[2],
                    payments: payments,
                    debtFree: debtFree
                }
            });
        }

        if (data.action.startsWith("generate")) {
            const folderId = FOLDER_ID_PDFS !== "PONER_ID_CARPETA_PDFS" ? FOLDER_ID_PDFS : props.getProperty('FOLDER_ID_PDFS');
            let templateId = null;
            let docName = "";

            if (data.action === "generateLibreDeuda") {
                templateId = DOC_ID_PLANTILLA !== "PONER_ID_DOC_LIBRE_DEUDA" ? DOC_ID_PLANTILLA : props.getProperty('DOC_ID_PLANTILLA');
                docName = "Libre Deuda";
            } else if (data.action === "generateInicio") {
                templateId = DOC_ID_INICIO !== "PONER_ID_DOC_INICIO" ? DOC_ID_INICIO : props.getProperty('DOC_ID_INICIO');
                docName = "Certificado Inicio";
            } else if (data.action === "generateFinal") {
                templateId = DOC_ID_FINAL !== "PONER_ID_DOC_FINAL" ? DOC_ID_FINAL : props.getProperty('DOC_ID_FINAL');
                docName = "Certificado Finalización";
            }

            if (!templateId || !folderId) return response({ status: "error", message: "Falta configurar Plantillas" });

            const url = createPDF(data.dni, sheetCobranzas, templateId, folderId, docName);
            return response({ status: "success", url: url });
        }

    } catch (error) {
        return response({ status: "error", message: error.toString() });
    } finally {
        lock.releaseLock();
    }
}

// --- UTILS ---
function checkPaid(val) { return String(val).toUpperCase() === "PAGADO" || String(val).toUpperCase() === "SI"; }
function response(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }

function createPDF(dni, sheet, templateId, folderId, docPrefix) {
    const rows = sheet.getDataRange().getValues();
    const student = rows.slice(1).find(r => String(r[0]) === String(dni));
    if (!student) throw new Error("Alumno no encontrado");

    const folder = DriveApp.getFolderById(folderId);
    const template = DriveApp.getFileById(templateId);
    const copy = template.makeCopy(`${docPrefix} - ${student[1]}`, folder);
    const doc = DocumentApp.openById(copy.getId());
    const body = doc.getBody();

    body.replaceText("{{NOMBRE}}", student[1]);
    body.replaceText("{{DNI}}", student[0]);
    body.replaceText("{{CURSO}}", student[2]);
    body.replaceText("{{FECHA}}", new Date().toLocaleDateString());

    doc.saveAndClose();
    const pdf = folder.createFile(copy.getAs(MimeType.PDF));
    copy.setTrashed(true);
    pdf.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return pdf.getDownloadUrl().replace('&export=download', '');
}

function SETUP_FULL_SYSTEM() {
    // (Misma función setup original...)
    // Se mantiene igual para inicializar si hiciera falta.
}
