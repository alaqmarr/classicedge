export interface BrandCertificate {
  id: string;
  title: string;
  issuedBy: string | null;
  fileUrl: string;
  sortOrder: number;
}

export interface BrandClient {
  id: string;
  name: string;
  logoUrl: string;
}

export interface OnlinePlatform {
  id: string;
  name: string;
  storeUrl: string;
  storeRegion: string;
  iconName: string;
  colorClass: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  imageUrl: string | null;
  mapUrl: string | null;
  sortOrder: number;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photoUrl: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  bio: string | null;
  sortOrder: number;
}

export interface ClassicConceptsBrandInfo {
  success: boolean;
  updatedAt: string;
  brand: {
    companyName: string;
    brandName: string;
    sisterBrand: string;
    sisterBrandUrl: string;
    tagline: string;
    website: string;
    logoUrl: string;
    shortLogoUrl: string;
    heroImageUrl: string;
    aboutIntroImageUrl: string;
    clientCarouselSpeedSeconds: number;
    certifications: {
      iso: string;
      hym: string;
      ga: string;
      ascb: string;
      allCertificates: BrandCertificate[];
    };
    clients: BrandClient[];
    onlinePlatforms: OnlinePlatform[];
  };
  contact: {
    address: string;
    primaryPhone: string;
    secondaryPhone: string | null;
    phones: string[];
    whatsappNumber: string;
    whatsappUrl: string;
    primaryEmail: string;
    secondaryEmail: string | null;
    emails: string[];
    businessHours: string;
    businessHoursLines: string[];
    mapEmbedUrl: string | null;
    payment: {
      upiId: string | null;
      upiName: string | null;
    };
  };
  branches: BranchInfo[];
  team: TeamMember[];
}

export async function getClassicConceptsBrandInfo(): Promise<ClassicConceptsBrandInfo | null> {
  try {
    const res = await fetch("https://classicconcepts.in/api/brand-info", {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error("Failed to fetch Classic Concepts brand info:", res.status);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching Classic Concepts brand info:", error);
    return null;
  }
}
