import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

/**
 * Formularios que funcionan con o sin servidor propio.
 *
 * - Con el servidor del proyecto (Express + tRPC) se guardan en la base de datos.
 * - En la versión estática (GitHub Pages, `VITE_STATIC=1`) se envían como JSON a
 *   `VITE_FORM_ENDPOINT` (por ejemplo, un formulario de Formspree). Si no hay
 *   endpoint configurado, el formulario avisa que el registro abrirá pronto.
 */

export const STATIC_SITE = import.meta.env.VITE_STATIC === "1";
const FORM_ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) ?? "";
export const FORMS_ENABLED = !STATIC_SITE || FORM_ENDPOINT.length > 0;

const SUBJECTS: Record<string, string> = {
  comunidad: "Druzhba · Nuevo registro en la comunidad",
  boletin: "Druzhba · Nueva suscripción al boletín",
  contacto: "Druzhba · Nuevo mensaje de contacto",
};

async function postForm(kind: string, data: Record<string, unknown>) {
  if (!FORM_ENDPOINT) throw new Error("FORMS_NOT_CONFIGURED");
  // Formspree: los arreglos se envían como texto y `_subject` titula el correo.
  const fields = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") || "—" : v]),
  );
  const res = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ formulario: kind, _subject: SUBJECTS[kind] ?? "Druzhba · Formulario", ...fields }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return { success: true } as const;
}

function useStaticForm<T extends Record<string, unknown>>(kind: string) {
  return useMutation({ mutationFn: (data: T) => postForm(kind, data) });
}

export function useSiteForms() {
  const join = trpc.community.join.useMutation();
  const newsletter = trpc.community.newsletter.useMutation();
  const contact = trpc.community.contact.useMutation();
  const sJoin = useStaticForm<{ name: string; email: string; city: string; interests: string[] }>("comunidad");
  const sNewsletter = useStaticForm<{ email: string }>("boletin");
  const sContact = useStaticForm<{ name: string; email: string; subject: string; message: string }>("contacto");
  return STATIC_SITE
    ? { join: sJoin, newsletter: sNewsletter, contact: sContact }
    : { join, newsletter, contact };
}
