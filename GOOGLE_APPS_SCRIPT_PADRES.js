// ----------------------------------------------------------------
// 👨‍👩‍👧‍👦 SCRIPT PORTAL PADRES - COLEGIO CRISTO REY
// ----------------------------------------------------------------
// INSTRUCCIONES:
// 1. Crea un nuevo proyecto en script.google.com
// 2. Pega este código.
// 3. Ejecuta la función 'SETUP_DEMO' una sola vez para crear la hoja y datos de prueba.
// 4. Implementa como Aplicación Web (Acceso: Cualquiera).

// --- CONFIGURACIÓN (Se llenarán solos al ejecutar SETUP_DEMO, o puedes poner los tuyos) ---
const SHEET_ID_COBRANZAS = "PONER_ID_AQUI_SI_YA_TIENES_HOJA";
const DOC_ID_PLANTILLA = "PONER_ID_DOC_PLANTILLA_AQUI";
const FOLDER_ID_PDFS = "PONER_ID_CARPETA_PDFS";

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const data = JSON.parse(e.postData.contents);

        // Si no definiste IDs arriba, intentamos buscarlos en las Propiedades del Script (Guardados por SETUP_DEMO)
        const props = PropertiesService.getScriptProperties();
        const sheetId = SHEET_ID_COBRANZAS !== "PONER_ID_AQUI_SI_YA_TIENES_HOJA" ? SHEET_ID_COBRANZAS : props.getProperty('SHEET_ID_COBRANZAS');

        if (!sheetId) return response({ status: "error", message: "Error de Configuración: Ejecuta SETUP_DEMO primero" });

        const ss = SpreadsheetApp.openById(sheetId);
        const sheet = ss.getSheetByName("Cobranzas 2026");

        // --- ACCIÓN: LOGIN ---
        if (data.action === "login") {
            const rows = sheet.getDataRange().getValues();
            const headers = rows[0];
            // Buscamos al alumno por DNI (Columna A - índice 0)
            // Asumimos estructura: A:DNI, B:Nombre, C:Curso, D:Matricula, E:Marzo... P:LibreDeuda

            const studentRow = rows.slice(1).find(r => String(r[0]).trim() === String(data.dni).trim());

            if (!studentRow) return response({ status: "error", message: "Alumno no encontrado" });

            // Mapeamos los pagos (indices basados en la hoja generada por SETUP_DEMO)
            const payments = {
                matricula: isPaid(studentRow[3]),
                mar: isPaid(studentRow[4]),
                abr: isPaid(studentRow[5]),
                may: isPaid(studentRow[6]),
                jun: isPaid(studentRow[7]),
                jul: isPaid(studentRow[8]),
                ago: isPaid(studentRow[9]),
                sep: isPaid(studentRow[10]),
                oct: isPaid(studentRow[11]),
                nov: isPaid(studentRow[12]),
                dic: isPaid(studentRow[13])
            };

            // Chequeo de deuda (Columna O - índice 14 en el demo es 'Estado')
            const debtFree = studentRow[14] === "AL DIA";

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

        // --- ACCIÓN: GENERAR PDF ---
        if (data.action === "generateLibreDeuda") {
            const docId = DOC_ID_PLANTILLA !== "PONER_ID_DOC_PLANTILLA_AQUI" ? DOC_ID_PLANTILLA : props.getProperty('DOC_ID_PLANTILLA');
            const folderId = FOLDER_ID_PDFS !== "PONER_ID_CARPETA_PDFS" ? FOLDER_ID_PDFS : props.getProperty('FOLDER_ID_PDFS');

            if (!docId || !folderId) return response({ status: "error", message: "Falta configurar Plantilla o Carpeta" });

            // Generar PDF (Lógica simplificada)
            const url = createPDF(data.dni, sheet, docId, folderId);
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

function createPDF(dni, sheet, templateId, folderId) {
    // 1. Obtener datos frescos
    const rows = sheet.getDataRange().getValues();
    const student = rows.slice(1).find(r => String(r[0]) === String(dni));
    if (!student) throw new Error("Alumno no encontrado");

    // 2. Copiar plantilla temporal
    const folder = DriveApp.getFolderById(folderId);
    const template = DriveApp.getFileById(templateId);
    const copy = template.makeCopy(`Libre Deuda - ${student[1]}`, folder);
    const doc = DocumentApp.openById(copy.getId());
    const body = doc.getBody();

    // 3. Reemplazar variables
    body.replaceText("{{NOMBRE}}", student[1]);
    body.replaceText("{{DNI}}", student[0]);
    body.replaceText("{{CURSO}}", student[2]);
    body.replaceText("{{FECHA}}", new Date().toLocaleDateString());
    body.replaceText("{{VENCIMIENTO}}", new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()); // +30 días

    doc.saveAndClose();

    // 4. Convertir a PDF y borrar temporal
    const pdfBlob = copy.getAs(MimeType.PDF);
    const pdf = folder.createFile(pdfBlob);
    copy.setTrashed(true);

    // 5. Permisos públicos (para que descargue directo)
    pdf.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return pdf.getDownloadUrl().replace('&export=download', '');
}

// ==========================================
// 🚀 HERRAMIENTA DE INSTALACIÓN (SETUP DEMO)
// ==========================================
// Ejecuta esta función UNA VEZ desde el editor
function SETUP_DEMO() {
    const ss = SpreadsheetApp.create("Base Cobranzas Cristo Rey 2026");
    const sheet = ss.getActiveSheet();
    sheet.setName("Cobranzas 2026");

    // 1. Crear Cabeceras
    const headers = ["DNI", "ALUMNO", "CURSO", "MATRICULA", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC", "ESTADO"];
    sheet.appendRow(headers);

    // 2. Datos de Prueba (Juan Perez y Maria Gomez)
    sheet.appendRow(["12345678", "Juan Pérez", "5to A", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "PAGADO", "AL DIA"]); // Al día
    sheet.appendRow(["87654321", "María Gómez", "3ro B", "PAGADO", "PAGADO", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "PENDIENTE", "DEUDA"]); // Deudor

    // Estilar
    sheet.getRange(1, 1, 1, 15).setBackground("#1B365D").setFontColor("white").setFontWeight("bold");
    sheet.autoResizeColumns(1, 15);

    // 3. Crear Carpeta para PDFs
    const folder = DriveApp.createFolder("Portal Padres - Certificados");

    // 4. Crear Plantilla Doc Demo
    const doc = DocumentApp.create("Plantilla Libre Deuda");
    const body = doc.getBody();
    body.appendParagraph("COLEGIO CRISTO REY").setHeading(DocumentApp.ParagraphHeading.HEADING1).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph("\nCERTIFICADO DE LIBRE DEUDA").setHeading(DocumentApp.ParagraphHeading.HEADING2).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph("\nPor medio de la presente se certifica que el alumno/a {{NOMBRE}}, DNI {{DNI}}, perteneciente al curso {{CURSO}}, no registra deuda exigible a la fecha {{FECHA}}.");
    body.appendParagraph("\nEste certificado tiene una validez hasta el {{VENCIMIENTO}}.");
    body.appendParagraph("\n\n__________________________\nAdministración").setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    doc.saveAndClose();

    // Mover Doc a la carpeta (opcional, para orden)
    const docFile = DriveApp.getFileById(doc.getId());
    docFile.moveTo(folder);

    // 5. Guardar IDs en Propiedades para que el script los encuentre
    PropertiesService.getScriptProperties().setProperties({
        'SHEET_ID_COBRANZAS': ss.getId(),
        'DOC_ID_PLANTILLA': doc.getId(),
        'FOLDER_ID_PDFS': folder.getId()
    });

    Logger.log("✅ INSTALACIÓN COMPLETADA EXITOSAMENTE");
    Logger.log("-------------------------------------");
    Logger.log("1. Base de Datos: " + ss.getUrl());
    Logger.log("2. Carpeta PDFs: " + folder.getUrl());
    Logger.log("3. Plantilla Doc: " + doc.getUrl());
    Logger.log("-------------------------------------");
    Logger.log("👉 AHORA: Publica este script como Aplicación Web y copia la URL en tu código React.");
}
