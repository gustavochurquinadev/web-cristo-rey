// ----------------------------------------------------------------
// 🎓 SISTEMA CRISTO REY - BACKEND UNIFICADO (ADMIN + PADRES)
// ----------------------------------------------------------------
// ESTE SCRIPT MANEJA TODO: ADMIN, PAGOS Y PORTAL DE PADRES.

const SPREADSHEET_ID = "PONER_ID_AQUI_SI_YA_TIENES_HOJA";
const DOC_ID_PLANTILLA = "PONER_ID_DOC_LIBRE_DEUDA";
const DOC_ID_INICIO = "PONER_ID_DOC_INICIO";
const DOC_ID_FINAL = "PONER_ID_DOC_FINAL";
const FOLDER_ID_PDFS = "PONER_ID_CARPETA_PDFS";

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

        // ==========================================
        // 🔐 MÓDULO ADMIN (CRUD + PAGOS)
        // ==========================================

        if (data.action === "getAll") {
            const rows = sheetLegajos.getDataRange().getValues();
            const students = rows.slice(1).map((r, i) => ({
                id: i + 2,
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
            // 1. Legajos
            sheetLegajos.appendRow([data.student.dni, data.student.apellido, data.student.nombre, data.student.nivel, data.student.grado, data.student.division, data.student.turno, "Regular"]);
            // 2. Cobranzas (Sync)
            const nombreFull = `${data.student.apellido}, ${data.student.nombre}`;
            const curso = `${data.student.grado}° ${data.student.division}`;
            sheetCobranzas.appendRow([data.student.dni, nombreFull, curso, "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "DEUDA"]);
            return response({ status: "success", message: "Alumno creado" });
        }

        if (data.action === "delete") {
            sheetLegajos.getRange(parseInt(data.id), 8).setValue("Baja");
            return response({ status: "success", message: "Baja procesada" });
        }

        if (data.action === "promoteAll") {
            // ... Lógica de promoción (simplificada para no alargar) ...
            // (Misma lógica que versión anterior)
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

            const monthMap = { 'matricula': 3, 'feb': 4, 'mar': 5, 'abr': 6, 'may': 7, 'jun': 8, 'jul': 9, 'ago': 10, 'sep': 11, 'oct': 12, 'nov': 13, 'dic': 14 }; // Ajustado a 0-index? No, getValues es array. A1 notation es 1-index.
            // Indices en array: Matrícula es [3].
            // Columna en Sheet: A=1... D=4. 
            // Si array index es 3, columna es 4.
            const colIndex = monthMap[data.month];
            sheetCobranzas.getRange(rowIndex + 1, colIndex + 1).setValue(data.paid ? "PAGADO" : "PENDIENTE"); // +1 porque sheet es 1-based

            // Actualizar estado deuda
            const currentRow = sheetCobranzas.getRange(rowIndex + 1, 1, 1, 16).getValues()[0];
            const hasDebt = currentRow.slice(3, 15).some(val => !checkPaid(val));
            sheetCobranzas.getRange(rowIndex + 1, 16).setValue(hasDebt ? "DEUDA" : "AL DIA");

            return response({ status: "success", message: "Pago actualizado" });
        }

        // ==========================================
        // 👪 MÓDULO PADRES (LOGIN + PDFS)
        // ==========================================

        if (data.action === "login") {
            const rows = sheetCobranzas.getDataRange().getValues(); // Usamos cobranzas porque tiene pagos y DNI
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
                    name: studentRow[1], // Nombre viene de Cobranzas (Sincronizado)
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

            // Buscar datos en Cobranzas para el PDF
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

// 🚀 SETUP COMPLETO (BASE DE DATOS + CARPETAS)
function SETUP_FULL_SYSTEM() {
    const ss = SpreadsheetApp.create("SISTEMA CRISTO REY - Base Unificada 2026");

    // 1. Hoja LEGAJOS
    let sheetL = ss.getSheetByName("Legajos 2026");
    if (!sheetL) sheetL = ss.insertSheet("Legajos 2026");
    sheetL.clear();
    sheetL.appendRow(["DNI", "APELLIDO", "NOMBRE", "NIVEL", "GRADO", "DIVISION", "TURNO", "ESTADO"]);
    sheetL.appendRow(["12345678", "Pérez", "Juan", "Secundario", 5, "A", "Mañana", "Regular"]);
    sheetL.getRange(1, 1, 1, 8).setBackground("#1B365D").setFontColor("white").setFontWeight("bold");

    // 2. Hoja COBRANZAS
    let sheetC = ss.getSheetByName("Cobranzas 2026");
    if (!sheetC) sheetC = ss.insertSheet("Cobranzas 2026");
    sheetC.clear();
    sheetC.appendRow(["DNI", "ALUMNO", "CURSO", "MATRICULA", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC", "ESTADO"]);
    sheetC.appendRow(["12345678", "Pérez, Juan", "5to A", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "DEUDA"]);
    sheetC.getRange(1, 1, 1, 16).setBackground("#2e7d32").setFontColor("white").setFontWeight("bold");
    sheetC.autoResizeColumns(1, 16);

    // 3. Carpeta Drive y Plantillas
    const folder = DriveApp.createFolder("Portal Padre - Documentos");

    const doc1 = DocumentApp.create("Plantilla Libre Deuda");
    doc1.getBody().appendParagraph("CERTIFICADO LIBRE DEUDA").setHeading(DocumentApp.ParagraphHeading.HEADING1);
    doc1.getBody().appendParagraph("\nSe certifica que {{NOMBRE}}, DNI {{DNI}}, no adeuda cuotas a la fecha.");
    doc1.saveAndClose();
    DriveApp.getFileById(doc1.getId()).moveTo(folder);

    const doc2 = DocumentApp.create("Plantilla Inicio");
    doc2.getBody().appendParagraph("CERTIFICADO INICIO").setHeading(DocumentApp.ParagraphHeading.HEADING1);
    doc2.getBody().appendParagraph("\n{{NOMBRE}} ha pagado matrícula y febrero.");
    doc2.saveAndClose();
    DriveApp.getFileById(doc2.getId()).moveTo(folder);

    const doc3 = DocumentApp.create("Plantilla Final");
    doc3.getBody().appendParagraph("CERTIFICADO FINAL").setHeading(DocumentApp.ParagraphHeading.HEADING1);
    doc3.getBody().appendParagraph("\n{{NOMBRE}} ha finalizado sus compromisos administrativos.");
    doc3.saveAndClose();
    DriveApp.getFileById(doc3.getId()).moveTo(folder);

    PropertiesService.getScriptProperties().setProperties({
        'SPREADSHEET_ID': ss.getId(),
        'DOC_ID_PLANTILLA': doc1.getId(),
        'DOC_ID_INICIO': doc2.getId(),
        'DOC_ID_FINAL': doc3.getId(),
        'FOLDER_ID_PDFS': folder.getId()
    });

    Logger.log("✅ SISTEMA TOTALMENTE CONFIGURADO");
    Logger.log("Hoja ID: " + ss.getId());
    Logger.log("URL Hoja: " + ss.getUrl());
}
