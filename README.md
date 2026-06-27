# FlexFix 🚚📦

**Gestión inteligente de paquetes para drivers de Amazon Flex**

FlexFix es una aplicación web progresiva (PWA) diseñada para ayudar a los conductores de Amazon Flex a organizar y gestionar sus paquetes de entrega de manera eficiente. Divide el vehículo en 4 zonas (A, B, C, D) y permite un control total del inventario con escaneo de códigos QR.

## 🎯 Características

- **4 Zonas de Vehículo**: Copiloto (A), Asiento trasero izquierda (B), Asiento trasero derecha (C), Maletero (D)
- **Offline-First**: Funciona sin conexión a internet
- **Escaneo QR**: Añade paquetes rápidamente escaneando códigos
- **Entrada Manual**: Ingresa códigos manualmente si es necesario
- **Estadísticas en Tiempo Real**: Visualiza progreso de entregas
- **Autenticación Simple**: Usuario y contraseña para sesiones seguras
- **PWA**: Instálable en dispositivos móviles como app nativa
- **Responsive**: Compatible con Safari y Chrome en mobile y desktop

## 🚀 Inicio Rápido

### Requisitos
- Node.js 16+ y npm

### Instalación

```bash
git clone https://github.com/guaricool/FlexFix.git
cd FlexFix
npm install
npm run dev
```

### Construcción para Producción

```bash
npm run build
npm run preview
```

## 📱 Credenciales de Demo

Para pruebas iniciales:
- **Usuario**: `demo`
- **Contraseña**: `123456`

## 🏗️ Estructura del Proyecto

```
FlexFix/
├── src/
│   ├── components/        # Componentes React reutilizables
│   ├── pages/            # Páginas principales
│   ├── db/               # Lógica de IndexedDB
│   ├── services/         # Servicios y utilidades
│   ├── styles/           # Archivos CSS
│   ├── App.jsx           # Componente raíz
│   └── main.jsx          # Punto de entrada
├── public/
│   ├── manifest.json     # Configuración PWA
│   └── sw.js            # Service Worker
├── vite.config.js        # Configuración Vite
└── index.html           # HTML principal
```

## 🗄️ Base de Datos (IndexedDB)

Los datos se guardan localmente en el navegador usando IndexedDB:
- **Sesiones**: Información de usuario y autenticación
- **Paquetes**: Código, zona, estado de entrega
- **Zonas**: Configuración de las 4 zonas
- **Cola de Sync**: Registra cambios para sincronización futura

## 🔄 Sincronización Futura

La app mantiene una cola de cambios listos para sincronizar con un backend cuando:
- Se conecte a internet
- Se implemente un API de sincronización

Actualmente todos los datos se guardan localmente.

## 📋 Uso

1. **Iniciar sesión** con usuario y contraseña
2. **Seleccionar una zona** (A, B, C o D)
3. **Agregar paquetes** manualmente o escaneando QR
4. **Marcar como entregado** ✓ cuando entregues cada paquete
5. **Ver estadísticas** en el dashboard

## 🎨 Colores y Branding

- **Primario**: `#FF9900` (Naranja Amazon)
- **Secundario**: `#146EB4` (Azul)
- **Éxito**: `#31A24C` (Verde)
- **Peligro**: `#FF6B6B` (Rojo)

## 🔐 Privacidad y Seguridad

- Todos los datos se guardan **localmente** en el dispositivo
- No se envía información personal a servidores externos
- Las contraseñas se almacenan de forma local (en producción usar hash)
- Compatible con HTTPS

## 📦 Dependencias Principales

- **React 18**: Framework UI
- **Vite**: Build tool rápido
- **Dexie**: Wrapper para IndexedDB
- **html5-qrcode**: Escaneo de códigos QR

## 🚧 Próximas Fases

- [ ] Integración con Amazon Flex API
- [ ] Backend para sincronización
- [ ] Reportes de entrega
- [ ] Múltiples sesiones simultáneas
- [ ] Notificaciones push
- [ ] Mapa de rutas

## 📄 Licencia

Proyecto educativo para optimización de entregas

## 👤 Autor

Creado para drivers de Amazon Flex

---

**¿Preguntas o sugerencias?** Abre un issue en GitHub
