export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'SYSTEM' | 'RECEPTIONIST';

export const permissions = {
  role: 'PATIENT' as Role,
  screening: {
    canCreateRequest: false,
    canUploadImage: false,
    canListAllRequests: false,
    canListUploadedRequests: false,
    canReadOwnDetail: true,
  },
  report: {
    canCreate: true,
    canReadMine: true,
  },
  appointment: {
    canCreate: true,
    canViewMine: true,
    canCancelMine: true,
    canRescheduleMine: true,
  },
  patientProfile: {
    canViewSelf: true,
    canEditSelf: true,
  },
} as const;

export const permissionMatrix = {
  '/screenings [GET]': 'ADMIN,DOCTOR',
  '/screenings/uploaded [GET]': 'DOCTOR',
  '/screenings [POST]': 'DOCTOR,ADMIN',
  '/screenings/:id/images/upload [POST]': 'DOCTOR,ADMIN',
  '/screenings/:id [GET]': 'ADMIN,DOCTOR, PATIENT(own only)',
  '/appointments/my/patient [GET]': 'PATIENT',
  '/patients/me [GET]': 'PATIENT',
  '/reports/my-reports [GET]': 'PATIENT',
} as const;

export default permissions;
