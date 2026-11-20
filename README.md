# Punto de venta - Taquería "El Vergel"

Punto de venta web para una taquería: toca los productos para armar el ticket, cobra con cambio calculado y lleva apertura y cortes X/Z de caja. Todo corre en el navegador; puede usarse en modo local (solo en este dispositivo) o sincronizada en red local con varias tablets conectadas a la computadora (ver "Sincronización en red").

## Cómo usarlo

1. Abre `index.html` en cualquier navegador (Windows, Android, tablet o celular). No necesita instalación ni internet.
2. **Pantalla de inicio:** al abrir el sistema verás arriba un **encabezado verde de ancho completo** con el emblema circular de El Vergel y el nombre "Taquería \"El Vergel\"" (más la píldora del estado de la caja). Debajo están los botones de caja (**Apertura de caja**, **Corte X** y **Corte Z**), un pequeño espacio y después las tarjetas grandes en dos filas de dos: primera fila **Punto de venta** y **Comandas** (muestra cuántas hay activas); segunda fila **Ventas** (historial de ventas) y **Configuración**. Cada pantalla tiene su propia dirección (la página termina en `#inicio`, `#pos`, `#comandas`, `#config` o `#ventas`): si recargas la página te quedas en la pantalla donde estabas, y el botón "atrás" del navegador regresa a la pantalla anterior.
3. **Apertura de caja:** en el inicio, toca "Apertura de caja", captura el fondo inicial (efectivo con el que empieza la caja) y toca "Iniciar caja".
4. **Vender:** entra a "Punto de venta" y toca los cuadritos de productos para agregarlos al ticket. Hay tres pestañas: **Tacos** (con dos secciones: Órdenes y Taco individual, mismas carnes), **Bebidas** (Refrescos y Aguas) y **Otros**. En el ticket puedes subir o bajar cantidades con − / +, quitar un producto con ×, o vaciar todo con "Vaciar". El ticket se guarda en el navegador: si recargas la página a la mitad de una venta, el ticket (y la pestaña activa) siguen ahí.
5. **Comanda:** en el propio ticket puedes escribir el **nombre del cliente** (opcional, campo arriba del ticket), agregar un **detalle por producto** (opcional: toca "＋ Agregar detalles" debajo de un producto y escribe, ej. "sin cebolla" en la orden de suadero) y **detalles generales** (opcional, campo junto al total, ej. "para llevar") para identificar la orden. Cuando el ticket está listo, toca "Comanda" para guardarlo como una comanda activa (la orden que está preparando el taquero) y limpiar el ticket por completo (incluidos nombre, detalles y notas). Todo es opcional: una comanda sin nombre ni detalles se crea igual. En la pantalla **Comandas** verás dos columnas divididas verticalmente: **Activas** (izquierda) y **Completadas** (derecha); en pantallas angostas se apilan una sobre otra. Toca "Entregada" cuando el cliente recibe su orden (pasa a Completadas) y "Pagada" cuando paga: se abre el modal de cobro, captura cuánto te dio el cliente en "Recibido" (o usa los botones rápidos, incluido "Exacto"), el "Cambio" se calcula solo, y al confirmar la venta queda registrada. **El cobro solo se hace desde las comandas**: en el punto de venta no hay botón de cobro directo.
6. **Corte X y Corte Z:** en el inicio hay dos cortes. **Corte X** (parcial): toca "Corte X" para ver el resumen del periodo hasta ese momento (fondo inicial, número de ventas, total vendido, efectivo esperado = fondo + vendido y la lista de ventas) sin cerrar la caja — puedes seguir vendiendo y hacer varios cortes X durante el turno. **Corte Z** (cierre final): toca "Corte Z" para ver el mismo resumen (con una línea "Cortes X realizados" si hubo cortes X en la sesión) y toca "Cerrar caja" para cerrar el periodo; después puedes hacer una nueva apertura. Ojo: el Corte Z **no se puede hacer si hay órdenes activas o sin pagar** (comandas en Activas o en Completadas); primero hay que entregarlas y cobrarlas todas. El Corte X no tiene esa restricción.
7. **Ventas:** en el inicio, toca "Ventas" para ver la pantalla moderna con las ventas registradas en tarjetas (total, fecha, productos, cliente, detalles, recibido y cambio), con un resumen arriba (total vendido y número de ventas **del día seleccionado**). Las ventas se muestran **por día**: arriba del resumen hay un navegador **‹ [día] ›** para cambiar entre días (al abrir la pantalla siempre empieza en hoy; el botón › se deshabilita en hoy y se puede retroceder a días anteriores aunque no tengan ventas, mostrando el estado vacío). Tocar la fecha del navegador abre un calendario propio para elegir el día directamente (meses con ‹ ›, los días con ventas se marcan con un punto y no se puede elegir un día futuro). Incluye las ventas de comandas pagadas. Para borrar el historial completo usa el botón "Borrar historial" en Configuración → pestaña General (ver abajo).
8. **Configuración:** en el inicio, toca "Configuración". Tiene tres pestañas:
   - **Productos:** edita el nombre y el precio de cualquier producto (cada producto se muestra como un recuadro de color igual que los cuadritos del punto de venta, en una rejilla: el nombre arriba, el precio con $ abajo y un botón × en la esquina para eliminar). Al final de cada sección hay un recuadro punteado **"＋ Agregar producto"** para crear productos nuevos. Si ya hay un recuadro vacío (sin nombre ni precio), al tocar "＋ Agregar producto" el recuadro vacío anterior se borra automáticamente, así nunca hay más de uno vacío a la vez; los productos con algo escrito no se tocan. Toca "Guardar cambios" y el punto de venta usa los valores nuevos de inmediato. Si un producto queda sin nombre o sin precio válido (vacío, 0 o negativo), se borra automáticamente al guardar (y también se limpian los productos nulos guardados anteriormente al abrir la app); si todos los productos quedaran vacíos, no se borra el catálogo y se avisa. Las ventas ya registradas conservan el nombre y precio con el que se hicieron.
   - **Dispositivos:** sección **"Sincronización en red"** (conectar la computadora y las tablets para compartir los mismos datos; ver la sección "Sincronización en red" más abajo), ajustes de la **impresora de tickets** (botón **"Buscar impresora"** que detecta la impresora conectada por Bluetooth o USB y muestra su nombre; si ya se conectó antes, el nombre aparece automáticamente al abrir la pestaña; el campo de nombre es de solo lectura (muestra la impresora conectada, o "Sin impresora conectada" si no hay ninguna); ancho de papel 58/80 mm, opción "Imprimir ticket automáticamente al cobrar" y botón **"Imprimir ticket de prueba"** que abre el diálogo de impresión con un ticket de muestra; sin impresora conectada los controles quedan deshabilitados) y la lista de **dispositivos conectados** (nombre, tipo —Caja/Computadora/Tablet/Celular/Otro— y permisos por dispositivo: Punto de venta, Comandas, Cobrar, Cortes de caja, Ventas y Configuración; se pueden agregar y eliminar; las tarjetas se muestran dos por fila en pantallas anchas (una por fila en pantallas angostas) y un dispositivo sin nombre se borra automáticamente, sin que nunca haya más de uno vacío a la vez). En modo local todo se guarda solo en este dispositivo; conectado, los dispositivos y permisos se sincronizan con la computadora.
   - **General:** cambia el **nombre de la sucursal** (por defecto "Taquería 'El Vergel'"); el nombre nuevo se refleja en el encabezado del inicio, en el encabezado del punto de venta y en el título de la página. También tiene la sección **"Historial de ventas"** con el botón **"Borrar historial"**, que borra todas las ventas registradas de todos los días (con confirmación); solo pueden usarlo los dispositivos con permiso de Configuración. Más opciones llegarán después.

## Sincronización en red (LAN)

La computadora puede ser el servidor y las tablets conectarse a ella para mandar comandas y ver los mismos datos en tiempo real. Todo funciona en la misma red Wi-Fi, sin internet.

### Cómo ponerla a andar

1. **En la computadora:** instala Node.js (gratis, de nodejs.org) y corre en la carpeta del proyecto:
   ```
   node server.js
   ```
   La ventana imprime la dirección para esta computadora (`http://localhost:8080/`) y la dirección para tablets y celulares (algo como `http://192.168.1.50:8080/`). Deja esa ventana abierta mientras uses la app.
2. **En la computadora:** abre `http://localhost:8080/` en el navegador. La app se conecta sola al servidor.
3. **En cada tablet o celular (misma Wi-Fi):** abre la dirección de la red que imprimió el servidor (la `http://192.168.x.x:8080/`). La app se conecta sola.
4. **Primera vez:** el primer dispositivo que se conecte manda sus datos al servidor (si tu celular ya tiene ventas y la computadora está vacía, conecta primero el celular para conservar esos datos). Después, el servidor manda en todo: lo que se haga en un dispositivo aparece en los demás.
5. **Si abres la app desde otro lugar** (por ejemplo el archivo `index.html` o GitHub Pages), ve a **Configuración → Dispositivos → "Sincronización en red"**, escribe la dirección de la computadora y toca **Conectar**. Para sincronizar, lo recomendado es abrir la app desde la dirección del servidor en todos los dispositivos.

### Versión .exe (sin instalar Node.js)

Si en la computadora de la taquería no quieres instalar Node.js, usa el ejecutable `taqueria-server.exe` (se genera con `build-exe.sh` y se entrega aparte; no está en GitHub porque es un binario):

1. Pon en una misma carpeta de la computadora: `taqueria-server.exe` y `index.html` (el de este repositorio).
2. Doble clic en `taqueria-server.exe`. La ventana imprime la dirección para esta computadora (`http://localhost:8080/`) y la dirección para tablets y celulares (algo como `http://192.168.1.50:8080/`). Deja esa ventana abierta mientras uses la app.
3. Abre esa dirección en el navegador de la computadora y en cada tablet (misma Wi-Fi), igual que con `node server.js`.

Notas:

- La primera vez Windows puede mostrar el aviso **"Windows protegió tu PC"**: toca **"Más información"** y luego **"Ejecutar de todas formas"**. Es normal con programas sin firmar.
- Los datos (`data.json` y su respaldo `data.json.bak`) se crean **junto al exe**, en la misma carpeta. Si mueves la carpeta, llévate también esos archivos para no perder los datos.
- **Actualizar la app no requiere un exe nuevo:** el servidor lee `index.html` de la carpeta al momento, así que basta con **reemplazar `index.html`** por la versión nueva. Solo si cambia el servidor mismo se genera un exe nuevo.
- Para compilar el exe (en una computadora con Node.js): `bash build-exe.sh` — deja el archivo en `dist/taqueria-server.exe`.

### Qué se sincroniza y qué no

- **Se sincroniza** (lo manda la computadora): catálogo, comandas, ventas, caja (apertura y cortes X/Z), dispositivos con sus permisos y nombre de sucursal.
- **Cada dispositivo guarda lo suyo:** el ticket en curso, la impresora y sus ajustes, la pestaña activa y la dirección del servidor. La **impresión de tickets sigue siendo local** en cada dispositivo.
- **Sin servidor** (archivo `index.html` o GitHub Pages sin conectar) todo sigue funcionando exactamente como antes, guardando en el navegador de ese dispositivo.

### Permisos

Cada dispositivo se registra al conectarse. Los dispositivos nuevos pueden ver todo y crear/cambiar comandas (el caso de las tablets), pero no pueden editar el catálogo, hacer cortes, cobrar, borrar el historial ni cambiar la configuración. La computadora (abierta con `http://localhost:8080`) administra todo. Desde **Configuración → Dispositivos** puedes renombrar cada dispositivo y darle más permisos. Los permisos se verifican en el servidor: si un dispositivo sin permiso intenta algo, aparece un aviso y los datos se vuelven a cargar del servidor.

### ¿Qué pasa si se va la luz?

**No se pierde nada.** Cada cambio se guarda en el disco de la computadora en el momento (archivo `data.json`, con escritura segura que nunca deja el archivo a medias, más un respaldo `data.json.bak`). Si se va la luz o se apaga la computadora:

- Las tablets siguen mostrando los últimos datos guardados (en modo de solo lectura, con un aviso arriba: "Sin conexión con la computadora..."). No se pueden hacer cambios hasta reconectar, para que nada se pierda ni se duplique.
- Cuando la computadora vuelva, corre `node server.js` otra vez y todo se vuelve a sincronizar solo, con los datos del servidor como autoritativos.

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
- Los datos (ventas, sesión abierta, cortes, comandas, cambios de catálogo, el ticket en curso y la pestaña activa) se guardan en el `localStorage` del navegador: sobreviven al cerrar la página, pero **son por navegador/dispositivo** — en modo local no se sincronizan entre computadoras ni celulares, y se borran si se limpia el historial del navegador. Con la sincronización en red (ver arriba) los datos viven en la computadora y se comparten entre dispositivos.

## Publicar en GitHub Pages

1. En GitHub, entra a **Settings → Pages** de este repositorio.
2. En "Build and deployment", elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Guarda. La app quedará en: `https://alexloza247.github.io/PuntoVenta_Taqueria/`

## Limitaciones de la v1

- Sin facturación.
- La sincronización en red requiere la computadora encendida con `node server.js` (o con `taqueria-server.exe`, ver "Versión .exe") y todos los dispositivos en la misma Wi-Fi; la impresión de tickets es local en cada dispositivo.
- El "efectivo esperado" de los cortes suma fondo + ventas; no distingue métodos de pago.
