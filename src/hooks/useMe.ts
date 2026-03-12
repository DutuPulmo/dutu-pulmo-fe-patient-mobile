import { useQuery } from '@tanstack/react-query';

import { patientService } from '@/services/patient.service';

export const meKeys = {
  all: ['users', 'me'] as const,
};

export function useMe() {
  return useQuery({
    queryKey: meKeys.all,
    queryFn: () => patientService.getMyProfile(),
    staleTime: 5 * 60 * 1000,
  });
}
