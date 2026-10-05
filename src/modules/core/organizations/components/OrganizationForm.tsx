import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import type { ReactNode } from "react";
import { z } from "zod";
import type { Organization, OrganizationPayload } from "../domain/organization";

const organizationSchema = z.object({
  name: z.string().trim().min(1, "Le nom est obligatoire."),
  code: z
    .string()
    .trim()
    .min(1, "Le code est obligatoire.")
    .max(20, "Le code ne peut pas dépasser 20 caractères."),
  description: z.string(),
  status: z.enum(["active", "inactive", "suspended"]),
  configuration: z.object({
    timezone: z.string().min(1, "Le fuseau horaire est obligatoire."),
    language: z.string().min(1, "La langue est obligatoire."),
    currency: z.string().min(1, "La devise est obligatoire."),
  }),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;
type ApiValidationErrors = Record<string, string[] | string>;

export function OrganizationForm({
  initialOrganization,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: {
  initialOrganization?: Organization;
  isSubmitting: boolean;
  submitError: unknown;
  onSubmit: (payload: OrganizationPayload) => Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: initialOrganization?.name ?? "",
      code: initialOrganization?.code ?? "",
      description: initialOrganization?.description ?? "",
      status: initialOrganization?.status ?? "active",
      configuration: {
        timezone: initialOrganization?.configuration.timezone ?? "Africa/Dakar",
        language: initialOrganization?.configuration.language ?? "fr",
        currency: initialOrganization?.configuration.currency ?? "XOF",
      },
    },
  });
  const showSubmitError =
    Boolean(submitError) && !(submitError as { response?: unknown }).response;
  const submit = async (values: OrganizationFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const response = (error as { response?: { data?: ApiValidationErrors } })
        .response?.data;
      if (response)
        Object.entries(response).forEach(([field, value]) => {
          const message = Array.isArray(value) ? value[0] : value;
          if (field in values)
            setError(field as keyof OrganizationFormValues, { message });
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
          Impossible d’enregistrer l’organisation. Vérifiez les champs puis
          réessayez.
        </p>
      )}
      <div className="form-grid">
        <section className="panel form-section">
          <div className="form-section-heading">
            <span className="eyebrow">IDENTITÉ</span>
            <h2>Informations générales</h2>
          </div>
          <FormField label="Nom de l’organisation" error={errors.name?.message}>
            <input {...register("name")} placeholder="Ex. NOLI CORE" />
          </FormField>
          <FormField label="Code" error={errors.code?.message}>
            <input {...register("code")} placeholder="Ex. NOLI" />
          </FormField>
          <FormField label="Description" error={errors.description?.message}>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Décrivez brièvement l’organisation"
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
            <span className="eyebrow">CONFIGURATION</span>
            <h2>Paramètres régionaux</h2>
          </div>
          <FormField
            label="Fuseau horaire"
            error={errors.configuration?.timezone?.message}
          >
            <select {...register("configuration.timezone")}>
              <option value="Africa/Dakar">Africa/Dakar</option>
              <option value="UTC">UTC</option>
              <option value="Europe/Paris">Europe/Paris</option>
            </select>
          </FormField>
          <FormField
            label="Langue"
            error={errors.configuration?.language?.message}
          >
            <select {...register("configuration.language")}>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </FormField>
          <FormField
            label="Devise"
            error={errors.configuration?.currency?.message}
          >
            <select {...register("configuration.currency")}>
              <option value="XOF">XOF · Franc CFA</option>
              <option value="EUR">EUR · Euro</option>
              <option value="USD">USD · Dollar américain</option>
            </select>
          </FormField>
          <div className="form-note">
            Ces paramètres seront utilisés par les futurs modules RH, contrats
            et pointage.
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
