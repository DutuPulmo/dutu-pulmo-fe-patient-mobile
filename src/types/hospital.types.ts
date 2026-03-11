export interface HospitalResponseDto {
  id: string;
  name: string;
  hospitalCode: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  province: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  logoUrl?: string;
  doctorCount?: number;
}

export interface PaginatedHospitalResponseDto {
  items: HospitalResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HospitalQueryDto {
  search?: string;
  city?: string;
  page?: number;
  limit?: number;
}
