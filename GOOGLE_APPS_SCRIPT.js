// --- CONFIGURACIÓN ---
const FOLDER_ID_RECIBOS = "1jXlN9xAbyMzDERjIwZmyFR99mmhDU0rs";
const FOLDER_ID_CV = "19EW5KYC3ceWqSmF_VPftRUEMde4xc6HV";
const FOLDER_ID_DOCS = "1Zrfb-LSBtzxuuk_W3xjW54txPieEbPxF";
const SHEET_ID = "1TAZR5kycw7gf7wc1bV9fxAgRlY7g7GMtOCuQohyX0Vk"; // ID del Sheet (Confirmado por URL)
const SECRET_TOKEN = "CRISTOREY2026";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);

    // --- 1. GESTIÓN DE CVs (Web Pública) ---
    if (!data.action) {
      const folder = DriveApp.getFolderById(FOLDER_ID_CV);
      const blob = Utilities.newBlob(Utilities.base64Decode(data.fileData), data.fileMimeType, data.fileName);
      const file = folder.createFile(blob);

      // CAMBIO ROBUSTO: Iterar para encontrar la hoja ignorando mayúsculas/espacios
      const sheets = ss.getSheets();
      let sheet = null;

      const targetNames = ["postulaciones web", "postulaciones", "postulacionesweb"];

      for (const s of sheets) {
        const cleanName = s.getName().toLowerCase().trim().replace(/\s+/g, ' '); // Normalizar espacios
        if (targetNames.includes(cleanName) || targetNames.includes(cleanName.replace(/\s/g, ''))) {
          sheet = s;
          break;
        }
      }

      if (!sheet) {
        // Log para depuración (retornar nombres disponibles)
        const available = sheets.map(s => s.getName()).join(", ");
        return response({ status: "error", message: `No se encontró la hoja 'Postulaciones Web'. Hojas disponibles: ${available}` });
      }

      // CAMBIO 2: Agregamos antigüedad antes del link
      // Orden: Fecha | Nombre | Email | Teléfono | Cargo | Antigüedad | Link CV
      sheet.appendRow([
        new Date(),
        data.name,
        data.email,
        data.phone,
        data.position,
        data.antiguedad || "N/A", // Valor nuevo
        file.getUrl()
      ]);

      return response({ status: "success", message: "Postulación recibida" });
    }

    // --- 2. LOGIN DOCENTE ---
    if (data.action === "login") {
      const rows = ss.getSheetByName("Base Docentes").getDataRange().getValues();
      const user = rows.slice(1).find(row => String(row[0]).trim() === String(data.dni).trim() && String(row[1]).trim() === String(data.password).trim());
      return user ? response({ status: "success", name: user[2] }) : response({ status: "error", message: "Datos incorrectos" });
    }

    // --- 3. REGISTRO DOCENTE ---
    if (data.action === "register") {
      if (data.token !== SECRET_TOKEN) return response({ status: "error", message: "Código incorrecto" });
      const sheet = ss.getSheetByName("Base Docentes");
      const rows = sheet.getDataRange().getValues();
      if (rows.slice(1).some(row => String(row[0]).trim() === String(data.dni).trim())) return response({ status: "error", message: "DNI registrado" });
      sheet.appendRow(["'" + data.dni, data.password, data.name]);
      return response({ status: "success", name: data.name });
    }

    // --- 4. BUSCAR MIS RECIBOS (PERSONAL) ---
    if (data.action === "getReceipts") {
      const parent = DriveApp.getFolderById(FOLDER_ID_RECIBOS);
      const subfolders = parent.getFolders();
      const receipts = [];
      while (subfolders.hasNext()) {
        const sub = subfolders.next();
        const files = sub.searchFiles(`title contains '${data.dni}_' and trashed = false`);
        while (files.hasNext()) {
          const file = files.next();
          const parts = file.getName().split('_');
          let legajo = "General";
          if (parts.length >= 4) legajo = parts[parts.length - 1].replace('.pdf', '');
          receipts.push({
            id: file.getId(),
            name: file.getName(),
            periodo: sub.getName(),
            legajo: legajo,
            date: file.getDateCreated(),
            url: file.getDownloadUrl().replace('&export=download', '')
          });
        }
      }
      receipts.sort((a, b) => b.date - a.date);
      return response({ status: "success", receipts: receipts });
    }

    // --- 5. OBTENER DOCUMENTOS PÚBLICOS ---
    if (data.action === "getPublicDocs") {
      const folder = DriveApp.getFolderById(FOLDER_ID_DOCS);
      const files = folder.getFiles();
      const docs = [];

      while (files.hasNext()) {
        const file = files.next();
        docs.push({
          id: file.getId(),
          name: file.getName().replace('.pdf', '').replace('.doc', '').replace('.docx', ''),
          type: file.getMimeType(),
          url: file.getDownloadUrl().replace('&export=download', '')
        });
      }
      return response({ status: "success", docs: docs });
    }

    // --- 6. ADMIN (CARPETAS Y UPLOAD) ---
    if (data.action === "getFolders") {
      const parent = DriveApp.getFolderById(FOLDER_ID_RECIBOS);
      const folders = parent.getFolders();
      const list = [];
      while (folders.hasNext()) { const f = folders.next(); list.push({ id: f.getId(), name: f.getName() }); }
      return response({ status: "success", folders: list });
    }
    if (data.action === "createFolder") {
      const parent = DriveApp.getFolderById(FOLDER_ID_RECIBOS);
      const newFolder = parent.createFolder(data.folderName);
      newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return response({ status: "success", id: newFolder.getId(), name: newFolder.getName() });
    }
    if (data.action === "uploadReceipt") {
      const folder = DriveApp.getFolderById(data.folderId);
      const blob = Utilities.newBlob(Utilities.base64Decode(data.fileData), "application/pdf", data.fileName);
      const file = folder.createFile(blob);
      return response({ status: "success", url: file.getUrl() });
    }

  } catch (e) {
    return response({ status: "error", error: e.toString() });
  } finally {
    lock.releaseLock();
  }
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
