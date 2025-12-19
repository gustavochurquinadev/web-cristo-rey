// ----------------------------------------------------------------
// 👨‍👩‍👧‍👦 SCRIPT PORTAL PADRES - COLEGIO CRISTO REY
// ----------------------------------------------------------------
// INSTRUCCIONES:
// 1. Crea un nuevo proyecto en script.google.com
// 2. Pega este código.
// 3. Ejecuta la función 'SETUP_DEMO' una sola vez para crear la hoja y datos de prueba.
// 4. Implementa como Aplicación Web (Acceso: Cualquiera).

// --- CONFIGURACIÓN ---
const SHEET_ID_COBRANZAS = "PONER_ID_AQUI_SI_YA_TIENES_HOJA";
const DOC_ID_PLANTILLA = "PONER_ID_DOC_LIBRE_DEUDA";
const DOC_ID_INICIO = "PONER_ID_DOC_INICIO"; // NUEVO
const DOC_ID_FINAL = "PONER_ID_DOC_FINAL";   // NUEVO
const FOLDER_ID_PDFS = "PONER_ID_CARPETA_PDFS";

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const data = JSON.parse(e.postData.contents);

        const props = PropertiesService.getScriptProperties();
        const sheetId = SHEET_ID_COBRANZAS !== "PONER_ID_AQUI_SI_YA_TIENES_HOJA" ? SHEET_ID_COBRANZAS : props.getProperty('SHEET_ID_COBRANZAS');

        if (!sheetId) return response({ status: "error", message: "Error de Configuración: Ejecuta SETUP_DEMO primero" });

        const ss = SpreadsheetApp.openById(sheetId);
        const sheet = ss.getSheetByName("Cobranzas 2026");

        // --- ACCIÓN: LOGIN ---
        if (data.action === "login") {
            const rows = sheet.getDataRange().getValues();
            const headers = rows[0];
            // Estructura: A:DNI, B:Nombre, C:Curso, D:Matricula, E:FEB, F:MAR... Q:LibreDeuda (Indices cambiaron por FEB)

            const studentRow = rows.slice(1).find(r => String(r[0]).trim() === String(data.dni).trim());

            if (!studentRow) return response({ status: "error", message: "Alumno no encontrado" });

            const payments = {
                matricula: isPaid(studentRow[3]),
                feb: isPaid(studentRow[4]), // NUEVO
                mar: isPaid(studentRow[5]),
                abr: isPaid(studentRow[6]),
                may: isPaid(studentRow[7]),
                jun: isPaid(studentRow[8]),
                jul: isPaid(studentRow[9]),
                ago: isPaid(studentRow[10]),
                sep: isPaid(studentRow[11]),
                oct: isPaid(studentRow[12]),
                nov: isPaid(studentRow[13]),
                dic: isPaid(studentRow[14])
            };

            // Estado está en columna P (índice 15)
            const debtFree = studentRow[15] === "AL DIA";

            return response({
                status: "success",
                student: {
                    name: studentRow[1],
                    course: studentRow[2],
                    dni: studentRow[0],
                    payments: payments,
                    debtFree: debtFree
                }
            });
        }

        // --- ACCIÓN: GENERAR PDFS ---
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

            if (!templateId || !folderId) return response({ status: "error", message: "Falta configurar Plantilla o Carpeta" });

            const url = createPDF(data.dni, sheet, templateId, folderId, docName);
            return response({ status: "success", url: url });
        }

    } catch (error) {
        return response({ status: "error", message: error.toString() });
    } finally {
        lock.releaseLock();
    }
}

// --- UTILIDADES ---
function isPaid(val) {
    return String(val).toUpperCase() === "PAGADO" || String(val).toUpperCase() === "SI";
}

function response(data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function createPDF(dni, sheet, templateId, folderId, docPrefix) {
    const rows = sheet.getDataRange().getValues();
    const student = rows.slice(1).find(r => String(r[0]) === String(dni));
    if (!student) throw new Error("Alumno no encontrado");

    const folder = DriveApp.getFolderById(folderId);
    const template = DriveApp.getFileById(templateId);
    const copy = template.makeCopy(`${docPrefix} - ${student[1]}`, folder);
    const doc = DocumentApp.openById(copy.getId());
    const body = doc.getBody();

    // Reemplazos comunes
    body.replaceText("{{NOMBRE}}", student[1]);
    body.replaceText("{{DNI}}", student[0]);
    body.replaceText("{{CURSO}}", student[2]);
    body.replaceText("{{FECHA}}", new Date().toLocaleDateString());
    body.replaceText("{{VENCIMIENTO}}", new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString());

    doc.saveAndClose();

    const pdfBlob = copy.getAs(MimeType.PDF);
    const pdf = folder.createFile(pdfBlob);
    copy.setTrashed(true);
    pdf.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return pdf.getDownloadUrl().replace('&export=download', '');
}

// ==========================================
// 🚀 SETUP DEMO (Ahora crea 3 plantillas)
// ==========================================
function SETUP_DEMO() {
    const ss = SpreadsheetApp.create("Base Cobranzas Cristo Rey 2026");
    const sheet = ss.getActiveSheet();
    sheet.setName("Cobranzas 2026");

    // 1. Crear Cabeceras (Con FEB)
    const headers = ["DNI", "ALUMNO", "CURSO", "MATRICULA", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC", "ESTADO"];
    sheet.appendRow(headers);

    // 2. Datos de Prueba
    sheet.appendRow(["12345678", "Juan Pérez", "5to A", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "AL DIA"]);
    sheet.appendRow(["87654321", "María Gómez", "3ro B", "PAGADO", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "DEUDA"]);

    sheet.getRange(1, 1, 1, 16).setBackground("#1B365D").setFontColor("white").setFontWeight("bold");
    sheet.autoResizeColumns(1, 16);

    // 3. Crear Carpeta
    const folder = DriveApp.createFolder("Portal Padres - Certificados");

    // 4a. Plantilla Libre Deuda
    const doc1 = DocumentApp.create("Plantilla Libre Deuda");
    doc1.getBody().appendParagraph("CERTIFICADO DE LIBRE DEUDA").setHeading(DocumentApp.ParagraphHeading.HEADING1);
    doc1.getBody().appendParagraph("\nSe certifica que {{NOMBRE}}, DNI {{DNI}}, no registra deuda al {{FECHA}}.");
    doc1.saveAndClose();
    DriveApp.getFileById(doc1.getId()).moveTo(folder);

    // 4b. Plantilla Inicio Lectivo
    const doc2 = DocumentApp.create("Plantilla Inicio Lectivo");
    doc2.getBody().appendParagraph("CERTIFICADO DE INICIO DE CICLO LECTIVO").setHeading(DocumentApp.ParagraphHeading.HEADING1);
    doc2.getBody().appendParagraph("\nSe certifica que el alumno/a {{NOMBRE}}, DNI {{DNI}}, del curso {{CURSO}}, ha abonado la matrícula y cuota de Febrero, encontrándose habilitado para iniciar el Ciclo Lectivo 2026.");
    doc2.getBody().appendParagraph("\nFecha de emisión: {{FECHA}}");
    doc2.saveAndClose();
    DriveApp.getFileById(doc2.getId()).moveTo(folder);

    // 4c. Plantilla Finalización
    const doc3 = DocumentApp.create("Plantilla Fin de Ciclo");
    doc3.getBody().appendParagraph("CERTIFICADO DE FINALIZACIÓN DE CICLO LECTIVO").setHeading(DocumentApp.ParagraphHeading.HEADING1);
    doc3.getBody().appendParagraph("\nSe certifica que {{NOMBRE}}, DNI {{DNI}}, ha completado los compromisos administrativos del Ciclo Lectivo 2026.");
    doc3.getBody().appendParagraph("\nFecha: {{FECHA}}");
    doc3.saveAndClose();
    DriveApp.getFileById(doc3.getId()).moveTo(folder);

    // 5. Guardar IDs
    PropertiesService.getScriptProperties().setProperties({
        'SHEET_ID_COBRANZAS': ss.getId(),
        'DOC_ID_PLANTILLA': doc1.getId(),
        'DOC_ID_INICIO': doc2.getId(),
        'DOC_ID_FINAL': doc3.getId(),
        'FOLDER_ID_PDFS': folder.getId()
    });

    Logger.log("✅ SETUP COMPLETADO: 3 Plantillas Creadas.");
    Logger.log("URL Sheet: " + ss.getUrl());
}
