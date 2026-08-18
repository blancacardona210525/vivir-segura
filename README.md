# Vivir Segura — V5 móvil corregida

Esta versión corrige específicamente el problema observado en teléfonos donde el HTML V4 se estaba mezclando con estilos V3 almacenados en caché.

## Cambios técnicos clave
- Los archivos principales ahora tienen nombres nuevos: `styles-v5.css`, `app-v5.js`, `manifest-v5.webmanifest`, `sw-v5.js`.
- El navegador ya no puede reutilizar por error el CSS antiguo con el HTML nuevo.
- Se limpian cachés de versiones anteriores.
- Se agregó CSS crítico dentro del propio `index.html` para mantener el menú lateral oculto y el logo pequeño incluso si falla la hoja de estilos externa.
- Se usan copias reducidas del logo para que nunca aparezca gigante por su tamaño natural.

## Mejoras móviles
- Encabezado compacto.
- Menú lateral de máximo 92% del ancho, en una sola columna.
- El menú permanece fuera de pantalla hasta tocar `Menú`.
- Sin barra inferior fija.
- Sin botón flotante de instalación.
- Instalación disponible dentro del menú y en escritorio.
- Portada móvil simplificada.
- Botones grandes, campos de 16 px para evitar zoom automático y mejor uso con una sola mano.
- Se oculta la portada grande de escritorio en pantallas pequeñas.

## Archivos que debes subir
Sube todos los archivos de este ZIP a la raíz de tu repositorio y elimina los archivos anteriores que tengan el mismo propósito.

Después de hacer Commit, abre la app una vez con el navegador actualizado. Esta V5 está diseñada para migrar automáticamente fuera de la caché anterior.
