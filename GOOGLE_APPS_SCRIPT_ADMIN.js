// ----------------------------------------------------------------
// 🎓 SISTEMA CRISTO REY - BACKEND SUPREMO
// 📦 VERSIÓN: 3.7 (Optimización Final: No-Lock Reads) - ACTUALIZADO: 19/12/2025
// ----------------------------------------------------------------
// ESTE SCRIPT MANEJA TODO: ADMIN, PAGOS, PORTAL PADRES Y SINCRONIZACIÓN.

// 🟢 ID CONFIGURADO MANUALMENTE POR EL USUARIO
const SPREADSHEET_ID = "1cxdXNmtKZc2kSyB6iqDUXbqOZykwSag5BFPHiaaEOII";

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
        .addItem('🎨 Aplicar Estilo y Lógica (Premium)', 'SETUP_STYLES')
        .addItem('🔍 Aplicar Filtros Automáticos', 'APPLY_FILTERS')
        .addSeparator()
        .addItem('⚙️ Configurar Plantillas PDF', 'SETUP_DOCS')
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

    const mapLegajos = {};
    for (let i = 1; i < dataL.length; i++) {
        let dni = String(dataL[i][0]).trim();
        // Estructura Nueva Legajos: 0=DNI, 1=ALUMNO
        if (dni) mapLegajos[dni] = { index: i, row: dataL[i] };
    }

    const mapCobranzas = {};
    for (let i = 1; i < dataC.length; i++) {
        let dni = String(dataC[i][0]).trim();
        if (dni) mapCobranzas[dni] = i;
    }

    let creados = 0;
    let actualizados = 0;
    let borrados = 0;

    // 2. PROCESO DE SINCRONIZACIÓN (LEGAJOS -> COBRANZAS)
    for (let dni in mapLegajos) {
        const lData = mapLegajos[dni].row;
        // NUEVA ESTRUCTURA LEGAJOS: 
        // 0=DNI, 1=ALUMNO ("PEREZ, Juan"), 2=NIVEL, 3=GRADO, 4=DIV, 5=TURNO, 6=ESTADO, 7=% BECA
        const nombreFull = lData[1];
        const curso = `${lData[3]}° ${lData[4]}`; // Antes era 4 y 5
        const estadoLegajo = String(lData[6]).toUpperCase(); // Antes era 7
        // const becaData = lData[7]; // Not syncing TO cobranzas yet, just keeping logic clean.

        if (mapCobranzas.hasOwnProperty(dni)) {
            // ACTUALIZAR
            const cIndex = mapCobranzas[dni];
            const cRow = cIndex + 1;

            sheetCobranzas.getRange(cRow, 2).setValue(nombreFull);
            sheetCobranzas.getRange(cRow, 3).setValue(curso);

            if (estadoLegajo === "BAJA") {
                sheetCobranzas.getRange(cRow, 1, 1, 16).setBackground("#ffebee");
            } else {
                if (sheetCobranzas.getSheetName().includes("Cobranzas")) {
                    sheetCobranzas.getRange(cRow, 1, 1, 16).setBackground(null);
                }
            }
            actualizados++;
        } else {
            // CREAR (NUEVO DEFAULT: ADEUDA)
            if (estadoLegajo !== "BAJA") {
                const newRow = [
                    dni, nombreFull, curso,
                    "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA",
                    "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA",
                    "AL DIA"
                ];
                sheetCobranzas.appendRow(newRow);
                creados++;
            }
        }
    }

    // B) Eliminar Huérfanos
    for (let i = dataC.length - 1; i >= 1; i--) {
        let dniC = String(dataC[i][0]).trim();
        if (!mapLegajos.hasOwnProperty(dniC)) {
            sheetCobranzas.deleteRow(i + 1);
            borrados++;
        }
    }

    // C) ORDENAR (Por Columna 2 - ALUMNO)
    if (sheetLegajos.getLastRow() > 1) sheetLegajos.getRange(2, 1, sheetLegajos.getLastRow() - 1, sheetLegajos.getLastColumn()).sort({ column: 2, ascending: true });
    if (sheetCobranzas.getLastRow() > 1) sheetCobranzas.getRange(2, 1, sheetCobranzas.getLastRow() - 1, sheetCobranzas.getLastColumn()).sort({ column: 2, ascending: true });

    ui.alert(`✅ Sincronización Completa y Ordenada:\n\n🆕 Nuevos: ${creados}\n🔄 Actualizados: ${actualizados}\n🗑️ Borrados: ${borrados}`);
}

// ----------------------------------------------------------------
// 🎨 FUNCIÓN ESTILOS "CLEAN LOOK"
// ----------------------------------------------------------------
function SETUP_STYLES() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = [ss.getSheetByName("Legajos 2026"), ss.getSheetByName("Cobranzas 2026")];
    const ui = SpreadsheetApp.getUi();

    sheets.forEach(sheet => {
        if (!sheet) return;

        // Header (Google Blue Clean)
        const lastCol = sheet.getLastColumn();
        // Forzamos cabeceras correctas si es Legajos
        if (sheet.getName() === "Legajos 2026") {
            const headers = [["DNI", "ALUMNO", "NIVEL", "GRADO", "DIVISION", "TURNO", "ESTADO", "% BECA"]];
            sheet.getRange(1, 1, 1, 8).setValues(headers);
        }

        const rangeData = sheet.getDataRange();
        rangeData.setFontFamily("Calibri");
        rangeData.setFontSize(11);
        rangeData.setVerticalAlignment("middle");

        const header = sheet.getRange(1, 1, 1, sheet.getLastColumn());
        header.setBackground("#4285f4");
        header.setFontColor("#ffffff");
        header.setFontWeight("bold");
        header.setHorizontalAlignment("center");

        // Limpiar estilos previos de datos y bandings
        if (sheet.getLastRow() > 1) {
            const fullRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
            fullRange.setBackground(null); // Limpiar fondo manual
            fullRange.setFontColor("#333333"); // Gris oscuro elegante
            fullRange.setFontFamily("Calibri");
            fullRange.setFontSize(11);
            fullRange.setVerticalAlignment("middle");

            // BORDE SUTIL
            fullRange.setBorder(true, true, true, true, true, true, "#d0d0d0", SpreadsheetApp.BorderStyle.SOLID);

            // ALINEACIONES ESPECÍFICAS (Solo para Legajos)
            if (sheet.getName() === "Legajos 2026") {
                // DNI (A) -> Centro
                sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).setHorizontalAlignment("center");
                // ALUMNO (B) -> Izquierda (Mejor lectura) y un poco de Padding visual si se pudiera (Sheets no tiene padding celdas facil, pero Left es clave)
                sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).setHorizontalAlignment("left").setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
                // RESTO (C-H) -> Centro
                sheet.getRange(2, 3, sheet.getLastRow() - 1, 6).setHorizontalAlignment("center");
            } else {
                // Para otras hojas (Cobranzas) todo centrado por defecto, salvo Nombre
                fullRange.setHorizontalAlignment("center");
                if (sheet.getLastColumn() >= 2) sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).setHorizontalAlignment("left");
            }

            // BANDING (ZEBRA) - Tono suave y profesional
            // Primero borramos anteriores para no duplicar
            try {
                const bandings = sheet.getBandings();
                bandings.forEach(b => b.remove());
            } catch (e) { }

            const rangeToBand = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
            const banding = rangeToBand.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
            banding.setHeaderRowColor(null); // No tocar header con banding, ya lo pintamos manual
            banding.setFirstRowColor("#ffffff");
            banding.setSecondRowColor("#f8f9fa"); // Gris muy muy clarito, no choca.
        }

    });

    // 2. LÓGICA COBRANZAS 
    // 2. LÓGICA COBRANZAS 
    const sheetC = ss.getSheetByName("Cobranzas 2026");
    if (sheetC) {
        const lastRow = sheetC.getLastRow();
        if (lastRow < 2) return;

        // ESTÉTICA COBRANZAS
        const rangeC = sheetC.getDataRange();
        rangeC.setHorizontalAlignment("center"); // Todo centrado base
        sheetC.getRange(2, 2, lastRow - 1, 1).setHorizontalAlignment("left"); // Nombre a la izquierda

        // VALIDACIÓN DE DATOS (Solo PAGADO / ADEUDA)
        const payRange = sheetC.getRange(2, 4, lastRow - 1, 12);
        const rule = SpreadsheetApp.newDataValidation()
            .requireValueInList(["PAGADO", "ADEUDA"], true)
            .setAllowInvalid(false)
            .build();
        payRange.setDataValidation(rule);

        sheetC.clearConditionalFormatRules();
        const rules = [];

        // VERDE (PAGADO)
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("PAGADO").setBackground("#e6f4ea").setFontColor("#137333").setBold(true).setRanges([payRange]).build());
        // ROJO (ADEUDA)
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("ADEUDA").setBackground("#fce8e6").setFontColor("#c5221f").setBold(true).setRanges([payRange]).build());

        // FÓRMULA INTELIGENTE DE ESTADO (COLUMNA P)
        // Lógica: Si hoy supera el día 10 del mes, y el mes no es PAGADO -> DEUDA.
        // Matricula (Col D) siempre se chequea.
        const formulaCell = sheetC.getRange("P2");

        // Explicación Fórmula:
        // Chequea cada mes. Si (MesActual > MesColumna) Y (Valor <> "PAGADO") => Suma Deuda.
        // Meses: Feb(2) a Dic(12). Matrícula se asume mes 1 (siempre exigible).
        const smartFormula = `=MAP(D2:D; E2:E; F2:F; G2:G; H2:H; I2:I; J2:J; K2:K; L2:L; M2:M; N2:N; O2:O; LAMBDA(mat; feb; mar; abr; may; jun; jul; ago; sep; oct; nov; dic; 
            LET(
                hoy; TODAY(); 
                m; MONTH(hoy); 
                d; DAY(hoy); 
                
                check; LAMBDA(mesNum; val; 
                    IF(val="PAGADO"; 0; 
                      IF(m > mesNum; 1; 
                        IF(AND(m = mesNum; d > 10); 1; 0)
                      )
                    )
                );

                deudaMat; IF(mat="PAGADO"; 0; 1);
                totalDeuda; deudaMat + check(2; feb) + check(3; mar) + check(4; abr) + check(5; may) + check(6; jun) + check(7; jul) + check(8; ago) + check(9; sep) + check(10; oct) + check(11; nov) + check(12; dic);
                
                IF(mat=""; ""; IF(totalDeuda > 0; "DEUDA"; "AL DIA"))
            )
        ))`;

        formulaCell.setFormula(smartFormula);

        const statusRange = sheetC.getRange(2, 16, lastRow - 1, 1);
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("AL DIA").setBackground("#0f9d58").setFontColor("#ffffff").setBold(true).setRanges([statusRange]).build());
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("DEUDA").setBackground("#d93025").setFontColor("#ffffff").setBold(true).setRanges([statusRange]).build());
        sheetC.setConditionalFormatRules(rules);
    }

    ui.alert("🎨 ¡Estructura Actualizada!\n\n- Header: Google Blue Clean.\n- Legajos: Columna '% BECA' añadida.\n- Legajos: 'ALUMNO' unificado.");
}

function SETUP_DOCS() {
    const ui = SpreadsheetApp.getUi();
    const userConfirm = ui.alert("⚠️ Configurar Documentos", "¿Deseas crear la carpeta y las plantillas?", ui.ButtonSet.YES_NO);
    if (userConfirm !== ui.Button.YES) return;
    try {
        const props = PropertiesService.getScriptProperties();
        const currentSheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
        props.setProperty("SPREADSHEET_ID", currentSheetId);
        const folder = DriveApp.createFolder("Certificados Cristo Rey 2026");
        const folderId = folder.getId();
        const docLibre = DocumentApp.create("Plantilla - Libre Deuda");
        docLibre.getBody().setText("INSTITUTO CRISTO REY\n\nLIBRE DEUDA\n\nCertificamos que {{NOMBRE}} (DNI: {{DNI}}), del curso {{CURSO}}, NO REGISTRA DEUDA a la fecha {{FECHA}}.\n\nAtte.\nAdministración.");
        DriveApp.getFileById(docLibre.getId()).moveTo(folder);
        const docInicio = DocumentApp.create("Plantilla - Certificado Inicio");
        docInicio.getBody().setText("INSTITUTO CRISTO REY\n\nCERTIFICADO DE ALUMNO REGULAR\n\nCertificamos que {{NOMBRE}} (DNI: {{DNI}}) es alumno regular del ciclo 2026 en el curso {{CURSO}}.\n\nFecha: {{FECHA}}");
        DriveApp.getFileById(docInicio.getId()).moveTo(folder);
        const docFinal = DocumentApp.create("Plantilla - Certificado Finalización");
        docFinal.getBody().setText("INSTITUTO CRISTO REY\n\nCERTIFICADO DE FINALIZACIÓN\n\nSe certifica que {{NOMBRE}} ha finalizado exitosamente el cursado de {{CURSO}}.\n\nFecha: {{FECHA}}");
        DriveApp.getFileById(docFinal.getId()).moveTo(folder);
        props.setProperty("FOLDER_ID_PDFS", folderId);
        props.setProperty("DOC_ID_PLANTILLA", docLibre.getId());
        props.setProperty("DOC_ID_INICIO", docInicio.getId());
        props.setProperty("DOC_ID_FINAL", docFinal.getId());
        ui.alert("✅ Plantillas Configuradas.");
    } catch (e) {
        ui.alert("❌ Error: " + e.toString());
    }
}

function APPLY_FILTERS() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = [ss.getSheetByName("Legajos 2026"), ss.getSheetByName("Cobranzas 2026")];
    sheets.forEach(sheet => {
        if (sheet) {
            if (sheet.getFilter()) { sheet.getFilter().remove(); }
            sheet.getDataRange().createFilter();
        }
    });
    SpreadsheetApp.getUi().alert("✅ Filtros aplicados.");
}

// ==========================================
// ⚡ BACKEND WEB (doPost)
// ==========================================

function doPost(e) {
    const lock = LockService.getScriptLock();
    // OPTIMIZACIÓN: Solo bloqueamos para escritura. Lecturas en paralelo.
    var data;
    try { data = JSON.parse(e.postData.contents); } catch (e) { return response({ error: "json" }); }

    const isWriteAction = ["create", "edit", "delete", "promoteAll", "updatePayment", "sync"].includes(data.action);

    if (isWriteAction) {
        lock.tryLock(10000); // 10s wait solo para escribir
    }

    try {
        const props = PropertiesService.getScriptProperties();
        const sheetId = SPREADSHEET_ID !== "PONER_ID_AQUI_SI_YA_TIENES_HOJA" ? SPREADSHEET_ID : props.getProperty('SPREADSHEET_ID');
        if (!sheetId) return response({ status: "error", message: "Error Config" });

        const ss = SpreadsheetApp.openById(sheetId);
        const sheetLegajos = ss.getSheetByName("Legajos 2026");
        const sheetCobranzas = ss.getSheetByName("Cobranzas 2026");

        if (!sheetLegajos || !sheetCobranzas) return response({ status: "error", message: "Faltan hojas" });

        if (data.action === "getAll") {
            // AUTO-REPARACIÓN DE CABECERA (Por si el usuario no corrió los estilos)
            if (sheetLegajos.getRange("H1").getValue() === "") {
                sheetLegajos.getRange("H1").setValue("% BECA").setBackground("#4285f4").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
            }

            const rowsLegajos = sheetLegajos.getDataRange().getValues();
            const rowsCobranzas = sheetCobranzas.getDataRange().getValues();

            const cobranzasMap = {};
            rowsCobranzas.slice(1).forEach(r => { cobranzasMap[String(r[0])] = r[15]; });

            const students = rowsLegajos.slice(1).map((r, i) => {
                const fullName = r[1] || "";
                let [apellido, nombre] = fullName.split(",");
                if (!nombre) { nombre = ""; } else { nombre = nombre.trim(); }
                if (!apellido) { apellido = fullName; } else { apellido = apellido.trim(); }

                let beca = 0;
                let isBecado = false;
                if (r[7] && r[7] !== "") {
                    beca = r[7];
                    isBecado = true;
                }

                return {
                    id: i + 2,
                    dni: String(r[0]),
                    apellido: apellido,
                    nombre: nombre,
                    nivel: r[2],
                    grado: r[3],
                    division: r[4],
                    turno: r[5],
                    estado: r[6],
                    isBecado: isBecado,
                    becaPorcentaje: beca,
                    saldo: cobranzasMap[String(r[0])] || "ADEUDA"
                };
            }).filter(s => s.dni !== "");
            return response({ status: "success", students: students });
        }

        if (data.action === "create") {
            const nombreFull = `${data.student.apellido}, ${data.student.nombre}`;
            const becaVal = data.student.isBecado ? data.student.becaPorcentaje : "";

            // Legajos: DNI(0), ALUMNO(1), NIVEL(2), GRADO(3), DIV(4), TURNO(5), ESTADO(6), BECA(7)
            sheetLegajos.appendRow([data.student.dni, nombreFull, data.student.nivel, data.student.grado, data.student.division, data.student.turno, "Regular", becaVal]);

            const curso = `${data.student.grado}° ${data.student.division}`;
            sheetCobranzas.appendRow([data.student.dni, nombreFull, curso, "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "ADEUDA", "AL DIA"]);
            return response({ status: "success", message: "Alumno creado" });
        }

        if (data.action === "edit") {
            const rowIdx = parseInt(data.id);
            const dni = data.student.dni;
            const nombreFull = `${data.student.apellido}, ${data.student.nombre}`;
            const becaVal = data.student.isBecado ? data.student.becaPorcentaje : "";

            sheetLegajos.getRange(rowIdx, 1).setValue(dni);
            sheetLegajos.getRange(rowIdx, 2).setValue(nombreFull);
            sheetLegajos.getRange(rowIdx, 3).setValue(data.student.nivel);
            sheetLegajos.getRange(rowIdx, 4).setValue(data.student.grado);
            sheetLegajos.getRange(rowIdx, 5).setValue(data.student.division);
            sheetLegajos.getRange(rowIdx, 6).setValue(data.student.turno);
            // Index 7 (estado) skipped
            sheetLegajos.getRange(rowIdx, 8).setValue(becaVal); // Index 8 is Col H (% BECA)

            const rowsC = sheetCobranzas.getDataRange().getValues();
            const cobRowIdx = rowsC.findIndex(r => String(r[0]) === String(dni));

            if (cobRowIdx !== -1) {
                const curso = `${data.student.grado}° ${data.student.division}`;
                sheetCobranzas.getRange(cobRowIdx + 1, 2).setValue(nombreFull);
                sheetCobranzas.getRange(cobRowIdx + 1, 3).setValue(curso);
            }

            return response({ status: "success", message: "Alumno editado correctamente" });
        }

        if (data.action === "delete") {
            const rowIdx = parseInt(data.id);
            sheetLegajos.deleteRow(rowIdx);

            // Opcional: Eliminar también de Cobranzas inmediatamente para mantener consistencia
            const rowsC = sheetCobranzas.getDataRange().getValues();
            // Buscar por DNI porque el ID (row) no necesariamente coincide
            // Obtenemos el DNI de la fila que acabamos de borrar? No, ya la borramos.
            // Deberíamos haber leído el DNI antes. Pero para simplificar y no complicar la transaccionalidad:
            // La función SYNC_FULL se encargará de limpiar huérfanos en Cobranzas.
            // O podemos forzar una limpieza rápida de huérfanos aquí si quisiéramos.

            return response({ status: "success", message: "Alumno eliminado definitivamente" });
        }

        if (data.action === "promoteAll") {
            const range = sheetLegajos.getDataRange();
            const values = range.getValues();
            for (let i = 1; i < values.length; i++) {
                let row = values[i];
                let nivel = row[2];
                let grado = parseInt(row[3]);
                if (row[6] === "Baja" || row[6] === "Egresado") continue;

                if (nivel === "Inicial" && grado === 5) { sheetLegajos.getRange(i + 1, 3).setValue("Primario"); sheetLegajos.getRange(i + 1, 4).setValue(1); }
                else if (nivel === "Primario" && grado === 7) { sheetLegajos.getRange(i + 1, 3).setValue("Secundario"); sheetLegajos.getRange(i + 1, 4).setValue(1); }
                else if (nivel === "Secundario" && grado === 5) { sheetLegajos.getRange(i + 1, 7).setValue("Egresado"); }
                else if (!isNaN(grado)) { sheetLegajos.getRange(i + 1, 4).setValue(grado + 1); }
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
            return response({ status: "success", message: "Pago actualizado" });
        }

        if (data.action === "login") {
            const rows = sheetCobranzas.getDataRange().getValues();
            const studentRow = rows.find(r => String(r[0]).trim() === String(data.dni).trim());
            if (!studentRow) return response({ status: "error", message: "Alumno no encontrado" });

            const payments = { matricula: checkPaid(studentRow[3]), feb: checkPaid(studentRow[4]), mar: checkPaid(studentRow[5]), abr: checkPaid(studentRow[6]), may: checkPaid(studentRow[7]), jun: checkPaid(studentRow[8]), jul: checkPaid(studentRow[9]), ago: checkPaid(studentRow[10]), sep: checkPaid(studentRow[11]), oct: checkPaid(studentRow[12]), nov: checkPaid(studentRow[13]), dic: checkPaid(studentRow[14]) };
            const debtFree = studentRow[15] === "AL DIA";
            return response({ status: "success", student: { dni: studentRow[0], name: studentRow[1], course: studentRow[2], payments: payments, debtFree: debtFree } });
        }

        if (data.action.startsWith("generate")) {
            const folderId = FOLDER_ID_PDFS !== "PONER_ID_CARPETA_PDFS" ? FOLDER_ID_PDFS : props.getProperty('FOLDER_ID_PDFS');
            let templateId = null;
            let docName = "";
            if (data.action === "generateLibreDeuda") { templateId = DOC_ID_PLANTILLA !== "PONER_ID_DOC_LIBRE_DEUDA" ? DOC_ID_PLANTILLA : props.getProperty('DOC_ID_PLANTILLA'); docName = "Libre Deuda"; }
            else if (data.action === "generateInicio") { templateId = DOC_ID_INICIO !== "PONER_ID_DOC_INICIO" ? DOC_ID_INICIO : props.getProperty('DOC_ID_INICIO'); docName = "Certificado Inicio"; }
            else if (data.action === "generateFinal") { templateId = DOC_ID_FINAL !== "PONER_ID_DOC_FINAL" ? DOC_ID_FINAL : props.getProperty('DOC_ID_FINAL'); docName = "Certificado Finalización"; }

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
    body.replaceText("{{NOMBRE}}", student[1]); body.replaceText("{{DNI}}", student[0]); body.replaceText("{{CURSO}}", student[2]); body.replaceText("{{FECHA}}", new Date().toLocaleDateString());
    doc.saveAndClose();
    const pdf = folder.createFile(copy.getAs(MimeType.PDF));
    copy.setTrashed(true);
    pdf.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return pdf.getDownloadUrl().replace('&export=download', '');
}
