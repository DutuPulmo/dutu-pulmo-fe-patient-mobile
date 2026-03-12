function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function getDoctorTitleLabel(title?: string): string {
  if (!title) return 'BS';

  const titleCodeMap: Record<string, string> = {
    SPECIALIST_DOCTOR_1: 'BS. CK1',
    SPECIALIST_DOCTOR_2: 'BS. CK2',
    MASTER: 'ThS. BS',
    MASTER_DOCTOR: 'ThS. BS',
    DOCTOR_ASSOCIATE_PROFESSOR: 'PGS. TS',
    ASSOCIATE_PROFESSOR_PHD_DOCTOR: 'PGS. TS',
    DOCTOR_PROFESSOR: 'GS. TS',
    PROFESSOR_PHD_DOCTOR: 'GS. TS',
    PHD: 'TS. BS',
    PHD_DOCTOR: 'TS. BS',
    DOCTOR: 'BS',
  };

  if (titleCodeMap[title]) return titleCodeMap[title];

  const normalized = normalizeText(title);
  if (normalized.includes('pho giao su')) return 'PGS. TS';
  if (normalized.includes('giao su')) return 'GS. TS';
  if (normalized.includes('chuyen khoa 2')) return 'BS. CK2';
  if (normalized.includes('chuyen khoa 1')) return 'BS. CK1';
  if (normalized.includes('thac si')) return 'ThS. BS';
  if (normalized.includes('tien si')) return 'TS. BS';

  return title;
}

export function getSpecialtyLabel(specialty: string): string {
  const map: Record<string, string> = {
    Pulmonology: 'Hô hấp',
    'Thoracic Surgery': 'Phẫu thuật lồng ngực',
    'Respiratory Medicine': 'Nội khoa hô hấp',
    Tuberculosis: 'Lao phổi',
  };

  return map[specialty] ?? specialty;
}
