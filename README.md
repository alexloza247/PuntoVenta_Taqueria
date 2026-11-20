# Punto de venta - Taquería "El Vergel"

Punto de venta web para una taquería: toca los productos para armar el ticket, cobra con cambio calculado y lleva apertura y corte de caja. Todo corre en el navegador, sin servidor.

## Cómo usarlo

1. Abre `index.html` en cualquier navegador (Windows, Android, tablet o celular). No necesita instalación ni internet.
2. **Pantalla de inicio:** al abrir el sistema verás el inicio con el emblema de El Vergel en una tarjeta blanca, el estado de la caja como una píldora (verde si está abierta) y tarjetas grandes con degradados verdes: **Punto de venta**, **Comandas** (muestra cuántas hay activas), **Configuración**, y abajo dos botones secundarios de **Apertura de caja** y **Corte de caja**.
3. **Apertura de caja:** en el inicio, toca "Apertura de caja", captura el fondo inicial (efectivo con el que empieza la caja) y toca "Iniciar caja".
4. **Vender:** entra a "Punto de venta" y toca los cuadritos de productos para agregarlos al ticket. Hay tres pestañas: **Tacos** (con dos secciones: Órdenes y Taco individual, mismas carnes), **Bebidas** (Refrescos y Aguas) y **Otros**. En el ticket puedes subir o bajar cantidades con − / +, quitar un producto con ×, o vaciar todo con "Vaciar".
5. **Comanda:** toca "Comanda" para guardar el ticket como una comanda activa (la orden que está preparando el taquero) y limpiar el ticket. En la pantalla **Comandas** verás dos columnas divididas verticalmente: **Activas** (izquierda) y **Completadas** (derecha); en pantallas angostas se apilan una sobre otra. Toca "Entregada" cuando el cliente recibe su orden (pasa a Completadas) y "Pagada" cuando paga: se abre el mismo modal de cobro y la venta queda registrada.
6. **Cobrar:** toca "Cobrar", captura cuánto te dio el cliente en "Recibido" (o usa los botones rápidos, incluido "Exacto"). El "Cambio" se calcula solo. Toca "Confirmar cobro" para registrar la venta y limpiar el ticket.
7. **Corte de caja:** en el inicio, toca "Corte de caja" para ver el resumen del periodo: fondo inicial, número de ventas, total vendido, efectivo esperado (fondo + vendido) y la lista de ventas. Toca "Cerrar caja" para cerrar el periodo; después puedes hacer una nueva apertura.
8. **Historial:** el botón "Historial" (dentro del punto de venta) muestra todas las ventas registradas (fecha, productos, total, recibido y cambio), incluidas las que entraron desde comandas pagadas.
9. **Configuración:** en el inicio, toca "Configuración" para editar el nombre y el precio de cualquier producto (cada producto es una tarjeta: el nombre en la primera fila y, en la segunda, el precio con $ y un botón × para eliminar). Al final de cada sección hay un botón **"＋ Agregar producto"** para crear productos nuevos. Toca "Guardar cambios" y el punto de venta usa los valores nuevos de inmediato (si un campo queda vacío o con precio 0, se marca en rojo y no se guarda). Las ventas ya registradas conservan el nombre y precio con el que se hicieron.

## Productos y precios

El catálogo trae valores por defecto en el código (objeto `CATALOG_DEFAULTS` al inicio del `<script>` en `index.html`) y se puede editar sin tocar el código desde la pantalla **Configuración** (nombre y precio de cada producto); los cambios se guardan en el navegador y sobreviven al recargar:

- Pestaña **Tacos**, sección **Órdenes** (la orden a $130.00): Orden de suadero, Orden de cuero, Orden de adobada, Orden de campechano
- Pestaña **Tacos**, sección **Taco individual** ($32.50 c/u): Taco de suadero, Taco de cuero, Taco de adobada, Taco de campechano
- Pestaña **Bebidas**, sección **Refrescos** ($30.00 c/u): Coca Cola, Sprite, Fanta
- Pestaña **Bebidas**, sección **Aguas** ($30.00 c/u): Agua de Jamaica, Agua de limón, Agua de horchata
- Pestaña **Otros**: Dulce ($2.00)

La app usa los colores de la taquería (verde y blanco, con el emblema circular de "El Vergel" en la esquina superior izquierda).

## Cómo funciona la caja

- Las ventas se pueden registrar con o sin caja abierta. El corte resume las ventas desde la última apertura (o desde el último corte si no hay caja abierta) y marca en el historial las ventas hechas "sin sesión".
- Los datos (ventas, sesión abierta, cortes, comandas y cambios de catálogo) se guardan en el `localStorage` del navegador: sobreviven al cerrar la página, pero **son por navegador/dispositivo** — no se sincronizan entre computadoras ni celulares, y se borran si se limpia el historial del navegador.

## Publicar en GitHub Pages

1. En GitHub, entra a **Settings → Pages** de este repositorio.
2. En "Build and deployment", elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Guarda. La app quedará en: `https://alexloza247.github.io/PuntoVenta_Taqueria/`

## Limitaciones de la v1

- Sin impresión de ticket ni facturación.
- Sin usuarios, permisos ni sincronización entre dispositivos (todo es local).
- El "efectivo esperado" del corte suma fondo + ventas; no distingue métodos de pago.
