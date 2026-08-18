# Vivir Segura — prototipo PWA

Prototipo web instalable para orientación sobre violencia de género, evaluación básica de riesgo y preparación de información para una denuncia en Honduras.

## Qué incluye

- Diseño adaptable a celular y computadora.
- PWA instalable desde un navegador compatible.
- Botón de salida rápida.
- Información sobre violencia física, psicológica, sexual, económica y patrimonial.
- Módulo orientativo de señales de riesgo.
- Formulario de pre-denuncia con campos opcionales y aviso explícito de que no constituye una denuncia oficial.
- Canales visibles 911, Línea 1-1-4 y FEP-MUJER.
- Backend FastAPI de demostración.
- Cifrado de cada reporte almacenado con Fernet.
- La app no usa localStorage ni sessionStorage para guardar el contenido del formulario.
- El service worker excluye las rutas `/api/` del caché.

## Ejecutar localmente

Requiere Python 3.10 o superior.

```bash
cd app_denuncia_genero
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

macOS/Linux:

```bash
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Abrir `http://127.0.0.1:8000`.

## Seguridad importante

Este código es un MVP y **no debe desplegarse como sistema oficial de denuncias sin una revisión de seguridad, jurídica y operativa**.

Antes de producción se recomienda, como mínimo:

1. HTTPS obligatorio, dominio institucional y HSTS.
2. Gestión de llaves mediante un KMS/HSM y rotación periódica; no usar la llave demo en archivo.
3. Base de datos administrada con cifrado, backups cifrados y políticas de retención/borrado.
4. Autenticación fuerte y control de acceso por roles para funcionariado autorizado.
5. Registro de auditoría que no incluya datos sensibles en texto claro.
6. Protección contra abuso, rate limiting, WAF y monitoreo de seguridad.
7. Evaluación de impacto de privacidad y revisión del marco jurídico hondureño aplicable.
8. Protocolo humano de recepción, clasificación de riesgo, derivación y seguimiento 24/7.
9. Integración formal con SEMUJER, Policía Nacional/SNE-911, Ministerio Público u otra institución receptora mediante convenio y API oficial.
10. Pruebas con mujeres usuarias, población indígena y afrohondureña, personas con discapacidad, baja alfabetización digital y contextos de conectividad limitada.
11. Soporte multilingüe y accesibilidad WCAG 2.2 AA.
12. Política específica para denuncias que involucren niñas, niños y adolescentes.

## Integración institucional sugerida

El endpoint `POST /api/reportes` actualmente cifra y guarda el contenido en una base local de demostración. Para una versión institucional debe reemplazarse la persistencia demo por un servicio receptor autenticado, con confirmación verificable de recepción y un flujo de seguimiento del caso.

Nunca mostrar a la usuaria el mensaje “denuncia presentada” hasta recibir una confirmación técnica y jurídica de la institución receptora.

## Canales incorporados en el prototipo

- Sistema Nacional de Emergencias: 911.
- Línea 1-1-4 “Mujer Vivir Sin Miedo”.
- FEP-MUJER: 2221-5620 y 2221-3099.

Estos datos deben verificarse nuevamente antes de cada publicación o despliegue institucional.
