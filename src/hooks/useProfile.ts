import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { patientService } from '@/services/patient.service';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/auth.store';
import type { UpdatePatientDto } from '@/types/patient.types';
import type { components } from '@/types/generated/patient-api';

type UpdateUserDto = components['schemas']['UpdateUserDto'];

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

export function useUpdateMyUser() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (payload: UpdateUserDto) => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        throw new Error('Missing current user id');
      }
      return userService.updateUser(userId, payload);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      void queryClient.invalidateQueries({ queryKey: profileKeys.myPatient });
      void queryClient.invalidateQueries({ queryKey: profileKeys.myProfile });
    },
  });
}
