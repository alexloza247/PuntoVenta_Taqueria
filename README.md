# Punto de venta - Taquería "El Vergel"

Punto de venta web para una taquería: toca los productos para armar el ticket, cobra con cambio calculado y lleva apertura y corte de caja. Todo corre en el navegador, sin servidor.

## Cómo usarlo

1. Abre `index.html` en cualquier navegador (Windows, Android, tablet o celular). No necesita instalación ni internet.
2. **Apertura de caja:** toca "Apertura de caja", captura el fondo inicial (efectivo con el que empieza la caja) y toca "Iniciar caja".
3. **Vender:** toca los cuadritos de productos para agregarlos al ticket. Hay dos pestañas: **Tacos** (con dos secciones: Órdenes y Taco individual, mismas carnes) y **Bebidas**. En el ticket puedes subir o bajar cantidades con − / +, quitar un producto con ×, o vaciar todo con "Vaciar".
4. **Cobrar:** toca "Cobrar", captura cuánto te dio el cliente en "Recibido" (o usa los botones rápidos, incluido "Exacto"). El "Cambio" se calcula solo. Toca "Confirmar cobro" para registrar la venta y limpiar el ticket.
5. **Corte de caja:** toca "Corte de caja" para ver el resumen del periodo: fondo inicial, número de ventas, total vendido, efectivo esperado (fondo + vendido) y la lista de ventas. Toca "Cerrar caja" para cerrar el periodo; después puedes hacer una nueva apertura.
6. **Historial:** el botón "Historial" muestra todas las ventas registradas (fecha, productos, total, recibido y cambio).

## Productos y precios

El catálogo está fijo en el código (objeto `CATALOG` al inicio del `<script>` en `index.html`), fácil de editar:

- Pestaña **Tacos**, sección **Órdenes** (la orden a $130.00): Orden de suadero, Orden de cuero, Orden de adobada, Orden de campechano
- Pestaña **Tacos**, sección **Taco individual** ($32.50 c/u): Taco de suadero, Taco de cuero, Taco de adobada, Taco de campechano
- Pestaña **Bebidas**, sección **Refrescos** ($30.00 c/u): Coca Cola, Sprite, Fanta
- Pestaña **Bebidas**, sección **Aguas** ($30.00 c/u): Agua de Jamaica, Agua de limón, Agua de horchata
- Pestaña **Otros**: sin productos por ahora (se agregan después en el `CATALOG`)

La app usa los colores de la taquería (verde y blanco, con el emblema circular de "El Vergel" en la esquina superior izquierda).

## Cómo funciona la caja

- Las ventas se pueden registrar con o sin caja abierta. El corte resume las ventas desde la última apertura (o desde el último corte si no hay caja abierta) y marca en el historial las ventas hechas "sin sesión".
- Los datos (ventas, sesión abierta, cortes) se guardan en el `localStorage` del navegador: sobreviven al cerrar la página, pero **son por navegador/dispositivo** — no se sincronizan entre computadoras ni celulares, y se borran si se limpia el historial del navegador.

## Publicar en GitHub Pages

1. En GitHub, entra a **Settings → Pages** de este repositorio.
2. En "Build and deployment", elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Guarda. La app quedará en: `https://alexloza247.github.io/PuntoVenta_Taqueria/`

## Limitaciones de la v1

- Sin impresión de ticket ni facturación.
- Sin usuarios, permisos ni sincronización entre dispositivos (todo es local).
- El catálogo y los precios se editan en el código; no hay pantalla de administración todavía.
- El "efectivo esperado" del corte suma fondo + ventas; no distingue métodos de pago.
