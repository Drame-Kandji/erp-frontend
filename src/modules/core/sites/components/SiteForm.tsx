import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Organization } from "../../organizations/domain/organization";
import type { Site, SitePayload } from "../domain/site";

const siteSchema = z
  .object({
    organization: z.string().uuid("Sélectionnez une organisation valide."),
    name: z.string().trim().min(1, "Le nom est obligatoire."),
    code: z
      .string()
      .trim()
      .min(1, "Le code est obligatoire.")
      .max(20, "Le code ne peut pas dépasser 20 caractères."),
    address: z.string(),
    latitude: z
      .string()
      .refine(
        (value) =>
          value === "" ||
          (Number.isFinite(Number(value)) &&
            Number(value) >= -90 &&
            Number(value) <= 90),
        "La latitude doit être comprise entre -90 et 90.",
      ),
    longitude: z
      .string()
      .refine(
        (value) =>
          value === "" ||
          (Number.isFinite(Number(value)) &&
            Number(value) >= -180 &&
            Number(value) <= 180),
        "La longitude doit être comprise entre -180 et 180.",
      ),
    status: z.enum(["active", "inactive", "suspended"]),
  })
  .superRefine((values, context) => {
    if ((values.latitude === "") !== (values.longitude === "")) {
      context.addIssue({
        code: "custom",
        path: ["latitude"],
        message: "Latitude et longitude doivent être fournies ensemble.",
      });
      context.addIssue({
        code: "custom",
        path: ["longitude"],
        message: "Latitude et longitude doivent être fournies ensemble.",
      });
    }
  });

type SiteFormValues = z.infer<typeof siteSchema>;
type ApiValidationErrors = Record<string, string[] | string>;

export function SiteForm({
  organizations,
  initialSite,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: {
  organizations: Organization[];
  initialSite?: Site;
  isSubmitting: boolean;
  submitError: unknown;
  onSubmit: (payload: SitePayload) => Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      organization: initialSite?.organization ?? organizations[0]?.id ?? "",
      name: initialSite?.name ?? "",
      code: initialSite?.code ?? "",
      address: initialSite?.address ?? "",
      latitude: initialSite?.latitude ?? "",
      longitude: initialSite?.longitude ?? "",
      status: initialSite?.status ?? "active",
    },
  });
  const showSubmitError =
    Boolean(submitError) && !(submitError as { response?: unknown }).response;
  const submit = async (values: SiteFormValues) => {
    try {
      await onSubmit({
        ...values,
        latitude: values.latitude || null,
        longitude: values.longitude || null,
      });
    } catch (error) {
      const response = (error as { response?: { data?: ApiValidationErrors } })
        .response?.data;
      if (response)
        Object.entries(response).forEach(([field, value]) => {
          const message = Array.isArray(value) ? value[0] : value;
          if (field in values)
            setError(field as keyof SiteFormValues, { message });
        });
    }
  };
  return (
    <form className="organization-form" onSubmit={handleSubmit(submit)}>
      <div className="form-toolbar">
        <button type="button" className="secondary-button" onClick={onCancel}>
          <ArrowLeft size={16} />
          Retour
        </button>
        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
        >
          <Save size={16} />
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
      {showSubmitError && (
        <p className="form-error">
          Impossible d’enregistrer le site. Vérifiez les champs puis réessayez.
        </p>
      )}
      <div className="form-grid">
        <section className="panel form-section">
          <div className="form-section-heading">
            <span className="eyebrow">IDENTITÉ</span>
            <h2>Informations générales</h2>
          </div>
          <FormField label="Organisation" error={errors.organization?.message}>
            <select {...register("organization")}>
              <option value="">Sélectionnez une organisation</option>
              {organizations.map((organization) => (
                <option value={organization.id} key={organization.id}>
                  {organization.name} · {organization.code}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Nom du site" error={errors.name?.message}>
            <input {...register("name")} placeholder="Ex. Site Dakar" />
          </FormField>
          <FormField label="Code" error={errors.code?.message}>
            <input {...register("code")} placeholder="Ex. DKR" />
          </FormField>
          <FormField label="Adresse" error={errors.address?.message}>
            <textarea
              {...register("address")}
              rows={4}
              placeholder="Adresse du site"
            />
          </FormField>
          <FormField label="Statut" error={errors.status?.message}>
            <select {...register("status")}>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
            </select>
          </FormField>
        </section>
        <section className="panel form-section">
          <div className="form-section-heading">
            <span className="eyebrow">GÉOLOCALISATION</span>
            <h2>Coordonnées GPS</h2>
          </div>
          <FormField label="Latitude" error={errors.latitude?.message}>
            <input
              {...register("latitude")}
              inputMode="decimal"
              placeholder="Ex. 14.716700"
            />
          </FormField>
          <FormField label="Longitude" error={errors.longitude?.message}>
            <input
              {...register("longitude")}
              inputMode="decimal"
              placeholder="Ex. -17.467700"
            />
          </FormField>
          <div className="form-note">
            Les deux coordonnées doivent être renseignées ensemble. Latitude :
            -90 à 90. Longitude : -180 à 180.
          </div>
        </section>
      </div>
    </form>
  );
}
function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
