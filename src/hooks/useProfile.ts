import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { patientService } from '@/services/patient.service';
import type { UpdatePatientDto } from '@/types/patient.types';

const profileKeys = {
  myPatient: ['profile', 'my-patient'] as const,
  myProfile: ['profile', 'my-profile'] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.myProfile,
    queryFn: () => patientService.getMyProfile(),
  });
}

export function useMyPatient() {
  return useQuery({
    queryKey: profileKeys.myPatient,
    queryFn: () => patientService.getMyPatient(),
  });
}

export function useUpdateMyPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePatientDto) => {
      const me = await patientService.getMyPatient();
      return patientService.updatePatient(me.id, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.myPatient });
      void queryClient.invalidateQueries({ queryKey: profileKeys.myProfile });
    },
  });
}
