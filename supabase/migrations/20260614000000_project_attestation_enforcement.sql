-- Enforce copyright attestation before publishing; track attestation text version.

ALTER TABLE anthem.projects
  ADD COLUMN IF NOT EXISTS rights_attestation_version text;

COMMENT ON COLUMN anthem.projects.rights_attestation_version IS
  'Version id of legal attestation text accepted at publish (see LEGAL_ATTESTATION_VERSION)';

-- Published projects must have attestation timestamp (client + API bypass protection).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'projects_published_requires_attestation'
  ) THEN
    ALTER TABLE anthem.projects
      ADD CONSTRAINT projects_published_requires_attestation
      CHECK (status IS DISTINCT FROM 'Published' OR rights_attested_at IS NOT NULL);
  END IF;
END $$;
