# 📤 Guía para Integrar el Formulario con Carga de CV

## 📋 Cambios Realizados

### Nuevas Posiciones:
- ✅ Docente - Nivel Inicial
- ✅ Docente - Nivel Primario
- ✅ Docente - Nivel Secundario
- ✅ Personal Administrativo
- ✅ Otros

### Campo de CV:
- ✅ Permite cargar archivos PDF, DOC y DOCX
- ✅ Tamaño máximo: 5MB
- ✅ Validación de formato y tamaño
- ✅ Interfaz drag-and-drop visual

## 🔌 Opciones para Conectar el Formulario

### Opción 1: EmailJS (Más Fácil - Sin Backend)

**Limitación:** EmailJS tiene un límite de tamaño de archivos pequeño (~1MB), por lo que necesitarías subir el CV a un servicio de almacenamiento primero.

```bash
npm install @emailjs/browser
```

**En src/App.jsx:**

```javascript
import emailjs from '@emailjs/browser';

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setFormLoading(true);
  
  try {
    // Primero envía el email con los datos
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      position: formData.position,
      experience: formData.experience,
      message: formData.message,
      cv_filename: formData.cv.name
    };
    
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      templateParams,
      'YOUR_PUBLIC_KEY'
    );
    
    setFormSubmitted(true);
    // Limpiar formulario...
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error al enviar el formulario. Por favor intenta de nuevo.');
  } finally {
    setFormLoading(false);
  }
};
```

### Opción 2: Backend con PHP (Recomendado)

Crea un archivo `contact.php` en tu servidor:

```php
<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $position = $_POST['position'];
    $experience = $_POST['experience'];
    $message = $_POST['message'];
    
    // Manejar el archivo CV
    $uploadDir = 'uploads/cv/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $cvFile = $_FILES['cv'];
    $fileName = time() . '_' . basename($cvFile['name']);
    $targetPath = $uploadDir . $fileName;
    
    if (move_uploaded_file($cvFile['tmp_name'], $targetPath)) {
        // Enviar email
        $to = 'rrhh@colegiocristorey.cl';
        $subject = 'Nueva Aplicación - ' . $position;
        $body = "
            Nombre: $name
            Email: $email
            Teléfono: $phone
            Posición: $position
            Experiencia: $experience
            Mensaje: $message
            
            CV adjunto: $fileName
        ";
        
        mail($to, $subject, $body);
        
        echo json_encode(['success' => true, 'message' => 'Formulario enviado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al subir el archivo']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
```

**En src/App.jsx:**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setFormLoading(true);
  
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('experience', formData.experience);
    formDataToSend.append('message', formData.message);
    formDataToSend.append('cv', formData.cv);
    
    const response = await fetch('https://tu-dominio.com/contact.php', {
      method: 'POST',
      body: formDataToSend
    });
    
    const result = await response.json();
    
    if (result.success) {
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        message: '',
        cv: null
      });
      setCvFileName('');
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error al enviar el formulario.');
  } finally {
    setFormLoading(false);
  }
};
```

### Opción 3: Firebase Storage (Google)

```bash
npm install firebase
```

**Crear firebase.js:**

```javascript
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
```

**En src/App.jsx:**

```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setFormLoading(true);
  
  try {
    // Subir CV a Firebase Storage
    const cvRef = ref(storage, `cvs/${Date.now()}_${formData.cv.name}`);
    const snapshot = await uploadBytes(cvRef, formData.cv);
    const cvUrl = await getDownloadURL(snapshot.ref);
    
    // Ahora puedes enviar el email con el link del CV
    console.log('CV URL:', cvUrl);
    
    // Enviar datos por email usando EmailJS o tu backend
    // incluye cvUrl en los datos
    
    setFormSubmitted(true);
    // Limpiar formulario...
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error al enviar el formulario.');
  } finally {
    setFormLoading(false);
  }
};
```

### Opción 4: Cloudinary (Servicio de Almacenamiento)

```bash
npm install cloudinary-react
```

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setFormLoading(true);
  
  try {
    // Subir a Cloudinary
    const formDataCloud = new FormData();
    formDataCloud.append('file', formData.cv);
    formDataCloud.append('upload_preset', 'TU_UPLOAD_PRESET');
    
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/TU_CLOUD_NAME/raw/upload',
      {
        method: 'POST',
        body: formDataCloud
      }
    );
    
    const data = await response.json();
    const cvUrl = data.secure_url;
    
    // Enviar email con el link del CV
    console.log('CV URL:', cvUrl);
    
    setFormSubmitted(true);
    // Limpiar formulario...
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setFormLoading(false);
  }
};
```

## 🎯 Recomendación

**Para un colegio pequeño/mediano:** Usa **Opción 2 (PHP Backend)** 
- Es simple
- Tienes control total
- No dependes de servicios externos
- Los archivos se guardan en tu servidor

**Para un proyecto más grande:** Usa **Opción 3 (Firebase)** o **Opción 4 (Cloudinary)**
- Escalable
- Seguro
- No requiere mantener tu propio servidor de archivos
- Backups automáticos

## 📧 Notificaciones por Email

Independientemente de la opción que elijas, puedes usar:

### SendGrid (Profesional)
```bash
npm install @sendgrid/mail
```

### Nodemailer (Si tienes tu propio servidor)
```bash
npm install nodemailer
```

### Gmail API (Gratis pero con limitaciones)

## 🔒 Seguridad

**Importante:**
1. Valida siempre el tipo de archivo en el backend
2. Limita el tamaño de los archivos
3. Renombra los archivos para evitar conflictos
4. Usa HTTPS en producción
5. Sanitiza los datos del formulario
6. Implementa CAPTCHA para evitar spam

## 📱 Ejemplo de Validación Backend (PHP)

```php
// Validar tamaño
$maxSize = 5 * 1024 * 1024; // 5MB
if ($cvFile['size'] > $maxSize) {
    die(json_encode(['success' => false, 'message' => 'Archivo muy grande']));
}

// Validar extensión
$allowedExtensions = ['pdf', 'doc', 'docx'];
$fileExtension = strtolower(pathinfo($cvFile['name'], PATHINFO_EXTENSION));
if (!in_array($fileExtension, $allowedExtensions)) {
    die(json_encode(['success' => false, 'message' => 'Extensión no permitida']));
}

// Validar tipo MIME
$allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $cvFile['tmp_name']);
if (!in_array($mimeType, $allowedMimes)) {
    die(json_encode(['success' => false, 'message' => 'Tipo de archivo no válido']));
}
```

## 🚀 Para Producción

No olvides:
1. Crear carpeta `uploads/cv/` con permisos correctos
2. Agregar `.htaccess` para proteger los archivos
3. Implementar sistema de limpieza de archivos antiguos
4. Configurar backups regulares
5. Monitorear el espacio en disco

## 📞 ¿Necesitas Ayuda?

Si necesitas ayuda implementando alguna de estas opciones, déjame saber cuál prefieres y te ayudo con el código específico.
