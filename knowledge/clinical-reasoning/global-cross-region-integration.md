# PHYSIOGUIDE AI — GLOBAL CROSS-REGION INTEGRATION

**Status:** ACTIVE  
**Role:** Capa **complementaria** — no sustituye el razonamiento regional (cadera, rodilla, hombro, tobillo, codo/muñeca, raquis).  
**Principles:** Ver master document. Nunca inventar Sn/Sp. Test ≠ diagnóstico.

---

## 1. DEFINITION

Cuando el cuadro **local no explica** síntomas clave, o cuando la anatomía de referido es plausible, el sistema debe **abrir/cribar la región proximal o distal relacionada** y permitir **coexistencia** (≥2 entidades).

Flujo global:

```
SÍNTOMA EN REGIÓN A
    ↓
RED FLAGS GLOBALES
    ↓
RAZONAMIENTO REGIONAL (Phase 1 de A)
    ↓
¿Tests locales reproducen dolor FAMILIAR?
    NO / poco → SUBIR referido / proximal
    SÍ pero faltan síntomas clave → coexistencia o trampa
    ↓
CRIBADO CROSS-REGION (1–3 preguntas/tests)
    ↓
REORDENAR HIPÓTESIS (local + referido)
    ↓
RECOMENDACIÓN
```

---

## 2. NON-NEGOTIABLES

- Esta capa **suplementa**; no borra el árbol regional.
- No saltar a «todo es cervical/lumbar» sin intentar local primero (salvo RF).
- Si lo local **no** reproduce el dolor familiar → subir proximal.
- Si hay hormigueo / déficit neurológico → no forzar solo tendón/ligamento.
- Permitir coexistencia (p. ej. RCRSP + cervical; LCA + menisco; fascia + S1).

---

## 3. CROSS-REGION MAP (OBLIGATORIO)

| Síntoma en… | Cribar también… | Pistas típicas |
|-------------|-----------------|----------------|
| Hombro | Cervical | Cuello, hormigueo, Spurling familiar, tests hombro pobres |
| Codo | Cervical / PIN / cubital | Hormigueo, cuello, Cozen poco familiar |
| Muñeca / mano | Cervical / mediano / cubital | Noche, territorio, cuello |
| Rodilla | Cadera / lumbar | Cojera, calcetines, RI cadera, lumbar, L4 |
| Pie / planta | Lumbar S1 / túnel tarsiano | Lumbar, ciática, hormigueo, Windlass pobre |
| Cadera / ingle | Lumbar / SI | Tests locales pobres, parestesias, lumbar |
| Ingle | Aductor / inguinal / pubis / hip-related (Doha) | Localización exacta Doha |
| Glúteo / isquio | Lumbar / deep gluteal / cadera | SLR, sentado, lateral vs isquio |
| Pantorrilla | TVP / Aquiles / S1 | Hinchazón unilateral, pop, lumbar |
| Escápula | Cervical / hombro / visceral | Cuello, RCRSP, síntomas sistémicos |

---

## 4. WHEN TO ACTIVATE CROSS-REGION

Activar cribado proximal/distal si:

1. Tests **locales** no reproducen el dolor **familiar**
2. Hay **hormigueo**, anestesia o debilidad neurológica
3. Dolor en zona A con **síntomas claros** de zona B (cuello, lumbar, cadera)
4. Patrón «típico local» **no explica** un síntoma clave
5. Adolescente con dolor de rodilla / cojera → **siempre** pensar cadera

---

## 5. GLOBAL RED-FLAG OVERLAY

Antes de razonamiento regional fino:

- Cardiovascular (hombro izquierdo + opresión/sudor/náuseas → URGENCIAS)
- Cauda equina / mielopatía
- Trauma + Ottawa / C-spine / escafoides
- TVP / compartimental
- Infección / cáncer (noche + pérdida peso + fiebre)

Un test blando **nunca** tranquiliza un red flag.

---

## 6. COEXISTENCE RULE

Ejemplos válidos:

- Hombro: RCRSP + cervical  
- Cadera: GTPS + aductor; hip-related + pubic  
- Rodilla: LCA + menisco; PFPS + ITB  
- Pie: fasciopatía + S1  
- Codo: LET + radiculopatía C6–C7  

No forzar una sola causa si el mapa pide dos.

---

## 7. LANGUAGE (AI)

- «También hay que pensar en el cuello/cadera/lumbar porque…»
- «Los tests locales no reprodujeron tu dolor habitual → sube la sospecha de origen referido»
- Nunca: «es solo tendón» si hay neural claro
- Nunca inventar % ni confirmar hernia/radiculopatía por un test

---

## 8. RELATION TO TRAP CASES

Los casos trampa (IAM, escafoides, necrosis, etc.) son **ejemplos** de esta capa. Aplicar el mapa §3 de forma sistemática, no solo la lista de trampas.

---

## 9. IMPLEMENTATION

- Rules: `physioguide-global-cross-region-rules.ts` (+ mobile + edge)
- Inyectar en consulta paciente, `physio_chat`, `physio_report`
- RAG: `Physioguide — Global — integración cross-region`
