# 📘 Guía de Usuario - Sistema Digital Cristo Rey

Bienvenido a la guía oficial de uso de la plataforma web. Este documento detalla todos los accesos disponibles y cómo utilizar las herramientas de gestión administrativa, docente y familiar.

---

## 📑 Índice de Accesos

| Módulo | Enlace / Ruta | Descripción |
| :--- | :--- | :--- |
| **Sitio Público** | `/` (Inicio) | Web institucional para el público general. |
| **Portal Docente** | `/portal` | Acceso a recibos de sueldo y documentos internos. |
| **Portal Familias** | `/familias` | Consulta de estado de cuenta para padres. |
| **Administración** | `/sistemalegajo` | Panel de control integral (Alumnos, Pagos y Sueldos). |

---

## 1. 🏫 Sitio Web Público
Disponible para toda la comunidad.
- **Noticias y Calendario:** Se actualizan automáticamente para informar de eventos.
- **Formularios de Contacto:** Las consultas llegan directamente al correo institucional.
- **Niveles Educativos:** Información detallada sobre Inicial, Primaria y Secundaria.

---

## 2. 👩‍🏫 Portal Docente (`/portal`)
Exclusivo para el personal del colegio.
1.  **Ingreso:** Requiere DNI y Contraseña.
2.  **Recibos de Haberes:** Puede visualizar y descargar sus recibos de sueldo en PDF.
3.  **Documentación:** Acceso a reglamentos y circulares.

**Nota:** Si es su primera vez, debe registrarse usando el **Código de Invitación** provisto por dirección.

---

## 3. 👨‍👩‍👧‍👦 Portal Familias (`/familias`)
Herramienta rápida para que los padres consulten su situación administrativa.
1.  **Ingreso Rápido:** Solo requiere el **DNI del Alumno**.
2.  **Estado de Cuenta:** El sistema mostrará un semáforo de estado:
    -   🟢 **AL DÍA:** No se registra deuda exigible.
    -   🔴 **CON DEUDA:** Existen cuotas pendientes.
    -   *Próximamente:* Botón para informar pagos.

---

## 4. 🛡️ Sistema de Gestión (`/sistemalegajo`)
Panel profesional para el equipo directivo y administrativo.
**Contraseña de Acceso:** `admin`

El sistema se divide en dos grandes áreas, accesibles desde el menú superior: **Legajos** y **Sueldos**.

### A. 📂 Sección LEGAJOS (Dashboard)
Aquí se gestiona la vida del alumno y la economía escolar.

#### 📊 Tablero de Control (Nuevo)
En la parte superior verá estadísticas en tiempo real:
-   **Matrícula Visible:** Cantidad de alumnos en pantalla.
-   **Solvencia:** Porcentaje de alumnos al día (Verde).
-   **Morosidad:** Porcentaje de deuda (Rojo).
-   **Becas:** Porcentaje de alumnos becados (Azul).

#### 🔍 Buscador y Filtros
-   **Buscador Inteligente:** Escriba nombre, apellido o DNI.
-   **Filtro por Nivel:** Seleccione Inicial, Primario o Secundario.
-   **Filtro por Curso:** Al seleccionar un nivel, se habilita el filtro de curso (ej: "1ro 1ra", "Sala 3").

#### 📝 Gestión de Alumnos
-   **Nuevo Alumno:** Botón "Nuevo Alumno" para inscribir (impacta en Excel automáticamente).
-   **Editar:** Clic en el lápiz para modificar datos.
-   **Pagos:** Clic en el botón verde/rojo de estado ($). Se abre una ficha donde puede marcar mes a mes como PAGADO o PENDIENTE. Al guardar, se actualiza el estado general automáticamente.
-   **Cerrar Ciclo Lectivo:** El botón rojo "CERRAR CICLO LECTIVO" promueve automáticamente a todos los alumnos al siguiente grado (ej: 1ro -> 2do). **Usar con precaución a fin de año.**

---

### B. 💼 Sección SUELDOS (Procesador de Recibos)
Herramienta para cortar y distribuir los recibos de sueldo digitales.

#### 📝 Paso a Paso para Cargar Recibos:
1.  **Ingrese a la pestaña "Sueldos"** desde el menú superior del admin.
2.  **Seleccione Destino:**
    -   Si la carpeta del mes ya existe (ej: `OCTUBRE_2025`), selecciónela de la lista.
    -   Si es un mes nuevo, escriba el nombre (ej: `NOVIEMBRE_2025`) y haga clic en el botón azul de "Crear Carpeta".
3.  **Cargar PDF Maestro:**
    -   Haga clic en el recuadro grande **"Subir PDF Maestro"**.
    -   Seleccione el archivo PDF único que le entrega el sistema contable (donde están todos los recibos juntos).
4.  **Proceso Automático:**
    -   El sistema leerá el PDF página por página.
    -   Detectará el DNI y Legajo de cada docente.
    -   Recortará el recibo individual.
    -   Lo guardará en Google Drive y lo vinculará al Portal del Docente.
5.  **Confirmación:** Verá una lista verde confirmando "Subido con éxito".

---

### 🆘 Soporte Técnico
Si el sistema presenta "pantalla azul" o errores de conexión:
1.  Verifique su conexión a internet.
2.  Recargue la página.
3.  Si persiste, contacte a soporte técnico indicando el mensaje de error.

*© 2025 Colegio Católico Cristo Rey - Documentación Interna*
