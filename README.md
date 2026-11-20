# Punto de venta - Taquería "El Vergel"

Punto de venta web para una taquería: toca los productos para armar el ticket, cobra con cambio calculado y lleva apertura y cortes X/Z de caja. Todo corre en el navegador, sin servidor.

## Cómo usarlo

1. Abre `index.html` en cualquier navegador (Windows, Android, tablet o celular). No necesita instalación ni internet.
2. **Pantalla de inicio:** al abrir el sistema verás arriba un **encabezado verde de ancho completo** con el emblema circular de El Vergel y el nombre "Taquería \"El Vergel\"" (más la píldora del estado de la caja). Debajo están los botones de caja (**Apertura de caja**, **Corte X** y **Corte Z**), un pequeño espacio y después las tarjetas grandes con degradados verdes: **Punto de venta**, **Comandas** (muestra cuántas hay activas) y **Configuración**. Cada pantalla tiene su propia dirección (la página termina en `#inicio`, `#pos`, `#comandas` o `#config`): si recargas la página te quedas en la pantalla donde estabas, y el botón "atrás" del navegador regresa a la pantalla anterior.
3. **Apertura de caja:** en el inicio, toca "Apertura de caja", captura el fondo inicial (efectivo con el que empieza la caja) y toca "Iniciar caja".
4. **Vender:** entra a "Punto de venta" y toca los cuadritos de productos para agregarlos al ticket. Hay tres pestañas: **Tacos** (con dos secciones: Órdenes y Taco individual, mismas carnes), **Bebidas** (Refrescos y Aguas) y **Otros**. En el ticket puedes subir o bajar cantidades con − / +, quitar un producto con ×, o vaciar todo con "Vaciar". El ticket se guarda en el navegador: si recargas la página a la mitad de una venta, el ticket (y la pestaña activa) siguen ahí.
5. **Comanda:** en el propio ticket puedes escribir el **nombre del cliente** (opcional, campo arriba del ticket), agregar un **detalle por producto** (opcional: toca "＋ Agregar detalles" debajo de un producto y escribe, ej. "sin cebolla" en la orden de suadero) y **detalles generales** (opcional, campo junto al total, ej. "para llevar") para identificar la orden. Cuando el ticket está listo, toca "Comanda" para guardarlo como una comanda activa (la orden que está preparando el taquero) y limpiar el ticket por completo (incluidos nombre, detalles y notas). Todo es opcional: una comanda sin nombre ni detalles se crea igual. En la pantalla **Comandas** verás dos columnas divididas verticalmente: **Activas** (izquierda) y **Completadas** (derecha); en pantallas angostas se apilan una sobre otra. Toca "Entregada" cuando el cliente recibe su orden (pasa a Completadas) y "Pagada" cuando paga: se abre el modal de cobro, captura cuánto te dio el cliente en "Recibido" (o usa los botones rápidos, incluido "Exacto"), el "Cambio" se calcula solo, y al confirmar la venta queda registrada. **El cobro solo se hace desde las comandas**: en el punto de venta no hay botón de cobro directo.
6. **Corte X y Corte Z:** en el inicio hay dos cortes. **Corte X** (parcial): toca "Corte X" para ver el resumen del periodo hasta ese momento (fondo inicial, número de ventas, total vendido, efectivo esperado = fondo + vendido y la lista de ventas) sin cerrar la caja — puedes seguir vendiendo y hacer varios cortes X durante el turno. **Corte Z** (cierre final): toca "Corte Z" para ver el mismo resumen (con una línea "Cortes X realizados" si hubo cortes X en la sesión) y toca "Cerrar caja" para cerrar el periodo; después puedes hacer una nueva apertura.
7. **Historial:** el botón "Historial" (dentro del punto de venta) muestra todas las ventas registradas (fecha, productos, total, recibido y cambio), incluidas las que entraron desde comandas pagadas.
8. **Configuración:** en el inicio, toca "Configuración" para editar el nombre y el precio de cualquier producto (cada producto se muestra como un recuadro de color igual que los cuadritos del punto de venta, en una rejilla: el nombre arriba, el precio con $ abajo y un botón × en la esquina para eliminar). Al final de cada sección hay un recuadro punteado **"＋ Agregar producto"** para crear productos nuevos. Toca "Guardar cambios" y el punto de venta usa los valores nuevos de inmediato (si un campo queda vacío o con precio 0, el recuadro se marca en rojo y no se guarda). Las ventas ya registradas conservan el nombre y precio con el que se hicieron.

## Productos y precios

El catálogo trae valores por defecto en el código (objeto `CATALOG_DEFAULTS` al inicio del `<script>` en `index.html`) y se puede editar sin tocar el código desde la pantalla **Configuración** (nombre y precio de cada producto); los cambios se guardan en el navegador y sobreviven al recargar:

- Pestaña **Tacos**, sección **Órdenes** (la orden a $130.00): Orden de suadero, Orden de cuero, Orden de adobada, Orden de campechano
- Pestaña **Tacos**, sección **Taco individual** ($32.50 c/u): Taco de suadero, Taco de cuero, Taco de adobada, Taco de campechano
- Pestaña **Bebidas**, sección **Refrescos** ($30.00 c/u): Coca Cola, Sprite, Fanta
- Pestaña **Bebidas**, sección **Aguas** ($30.00 c/u): Agua de Jamaica, Agua de limón, Agua de horchata
- Pestaña **Otros**: Dulce ($2.00)

La app usa los colores de la taquería (verde y blanco, con el emblema circular de "El Vergel" en la esquina superior izquierda).

## Cómo funciona la caja

- Las ventas se pueden registrar con o sin caja abierta. El corte Z resume las ventas desde la última apertura (o desde el último corte si no hay caja abierta) y marca en el historial las ventas hechas "sin sesión".
- Los datos (ventas, sesión abierta, cortes, comandas, cambios de catálogo, el ticket en curso y la pestaña activa) se guardan en el `localStorage` del navegador: sobreviven al cerrar la página, pero **son por navegador/dispositivo** — no se sincronizan entre computadoras ni celulares, y se borran si se limpia el historial del navegador.

## Publicar en GitHub Pages

1. En GitHub, entra a **Settings → Pages** de este repositorio.
2. En "Build and deployment", elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Guarda. La app quedará en: `https://alexloza247.github.io/PuntoVenta_Taqueria/`

## Limitaciones de la v1

- Sin impresión de ticket ni facturación.
- Sin usuarios, permisos ni sincronización entre dispositivos (todo es local).
- El "efectivo esperado" de los cortes suma fondo + ventas; no distingue métodos de pago.
